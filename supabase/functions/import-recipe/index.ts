import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RECIPE_PIXIE_URL = "https://bmghizokulvmkzwisinz.supabase.co/functions/v1/export-recipes";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const recipePixieApiKey = Deno.env.get('RECIPE_PIXIE_API_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Parse request body for optional force parameter
    let force = false;
    try {
      const body = await req.json();
      force = body.force === true;
    } catch {
      // No body or invalid JSON - that's fine
    }

    console.log(`Import started. Force mode: ${force}`);

    // Check import settings (unless force mode)
    if (!force) {
      const { data: settings, error: settingsError } = await supabase
        .from('import_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsError) {
        console.error('Error fetching settings:', settingsError);
        throw new Error('Could not fetch import settings');
      }

      if (!settings) {
        console.log('No import settings found');
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'No import settings configured' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!settings.enabled) {
        console.log('Import is disabled');
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Import is disabled' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if it's time to import
      const now = new Date();
      if (settings.next_import_at && new Date(settings.next_import_at) > now) {
        console.log(`Not yet time to import. Next import at: ${settings.next_import_at}`);
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Not yet time for next import',
          next_import_at: settings.next_import_at
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fetch recipe from Recipe Pixie
    console.log('Fetching recipe from Recipe Pixie...');
    const pixieResponse = await fetch(RECIPE_PIXIE_URL, {
      method: 'GET',
      headers: {
        'x-api-key': recipePixieApiKey,
      },
    });

    if (!pixieResponse.ok) {
      const errorText = await pixieResponse.text();
      console.error('Recipe Pixie API error:', pixieResponse.status, errorText);
      throw new Error(`Recipe Pixie API returned ${pixieResponse.status}: ${errorText}`);
    }

    const pixieData = await pixieResponse.json();
    console.log('Recipe Pixie response:', JSON.stringify(pixieData));

    // Check if we got a recipe
    if (!pixieData.success || !pixieData.recipe) {
      console.log('No recipe available from Recipe Pixie');
      return new Response(JSON.stringify({ 
        success: false, 
        message: pixieData.message || 'No recipe available for export'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sourceRecipe = pixieData.recipe;
    console.log(`Received recipe: ${sourceRecipe.title} (ID: ${sourceRecipe.id})`);

    // Check for duplicates
    const { data: existingImport } = await supabase
      .from('imported_recipes')
      .select('id, local_recipe_id')
      .eq('source_recipe_id', sourceRecipe.id)
      .eq('source_project', 'recipe-pixie')
      .maybeSingle();

    if (existingImport) {
      console.log(`Recipe already imported: ${sourceRecipe.id}`);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Recipe already imported',
        local_recipe_id: existingImport.local_recipe_id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert schema from Recipe Pixie to cookitsimple format
    const convertedRecipe = convertRecipeSchema(sourceRecipe);
    console.log('Converted recipe:', JSON.stringify(convertedRecipe));

    // Insert recipe into local database
    const { data: newRecipe, error: insertError } = await supabase
      .from('recipes')
      .insert(convertedRecipe)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting recipe:', insertError);
      throw new Error(`Failed to insert recipe: ${insertError.message}`);
    }

    console.log(`Recipe inserted with ID: ${newRecipe.id}`);

    // Log import
    const { error: logError } = await supabase
      .from('imported_recipes')
      .insert({
        source_recipe_id: sourceRecipe.id,
        source_project: 'recipe-pixie',
        local_recipe_id: newRecipe.id,
        raw_data: sourceRecipe,
      });

    if (logError) {
      console.error('Error logging import:', logError);
      // Don't fail the whole operation for logging errors
    }

    // Update import settings with timestamps
    const { data: currentSettings } = await supabase
      .from('import_settings')
      .select('frequency')
      .limit(1)
      .maybeSingle();

    if (currentSettings) {
      const nextImport = calculateNextImport(currentSettings.frequency);
      await supabase
        .from('import_settings')
        .update({
          last_import_at: new Date().toISOString(),
          next_import_at: nextImport.toISOString(),
        })
        .eq('id', (await supabase.from('import_settings').select('id').limit(1).single()).data?.id);
    }

    console.log('Import completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Recipe imported successfully',
      recipe: {
        id: newRecipe.id,
        title: newRecipe.title,
        slug: newRecipe.slug,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function convertRecipeSchema(source: any) {
  // Convert ingredients from [{name, amount, unit}] to ["500g Mehl", ...]
  const ingredients = (source.ingredients || []).map((ing: any) => {
    const parts = [];
    if (ing.amount) parts.push(ing.amount);
    if (ing.unit) parts.push(ing.unit);
    if (ing.name) parts.push(ing.name);
    return parts.join(' ').trim() || ing.name || '';
  }).filter((i: string) => i);

  // Convert steps from [{step: "Text"}] to ["Text", ...]
  const instructions = (source.steps || []).map((s: any) => 
    typeof s === 'string' ? s : (s.step || s.text || '')
  ).filter((s: string) => s);

  // Calculate total time
  const totalMinutes = (source.work_minutes || 0) + (source.cook_minutes || 0) + (source.rest_minutes || 0);
  const time = totalMinutes > 0 ? `${totalMinutes} Min` : '30 Min';

  // Generate slug from title
  const slug = generateSlug(source.title);

  // Map difficulty (should already be text)
  const difficulty = source.difficulty || 'mittel';

  // Map category
  const category = source.category || 'Hauptgerichte';

  return {
    title: source.title,
    slug: slug,
    description: source.subtitle || source.description || `Ein leckeres Rezept für ${source.title}`,
    ingredients: ingredients,
    instructions: instructions,
    time: time,
    difficulty: difficulty,
    category: category,
    servings: source.servings || 4,
    image_url: source.image_url || null,
    featured: false,
    published: true,
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function calculateNextImport(frequency: string): Date {
  const now = new Date();
  const next = new Date(now);
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'every_2_days':
    default:
      next.setDate(next.getDate() + 2);
      break;
  }
  
  return next;
}
