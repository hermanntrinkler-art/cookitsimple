import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Users, ChefHat, ArrowLeft, Printer, Share2 } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  time: string;
  servings: number;
  difficulty: string;
  image_url: string | null;
  ingredients: string[];
  instructions: string[];
}

interface RelatedRecipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  time: string;
  servings: number;
  image_url: string | null;
}

const categoryMap: Record<string, string> = {
  'hauptgerichte': 'Hauptgerichte',
  'dessert': 'Desserts',
  'desserts': 'Desserts',
  'vorspeisen': 'Vorspeisen',
  'salate': 'Salate',
  'suppen': 'Suppen',
  'backen': 'Backen',
};

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<RelatedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching recipe:', error);
      } else {
        setRecipe(data);
      }

      // Fetch related recipes
      const { data: related } = await supabase
        .from('recipes')
        .select('id, title, slug, category, time, servings, image_url')
        .eq('published', true)
        .neq('slug', slug)
        .limit(3);

      setRelatedRecipes(related || []);
      setLoading(false);
    };

    fetchRecipe();
  }, [slug]);

  const getDisplayCategory = (category: string) => {
    return categoryMap[category.toLowerCase()] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Lade Rezept...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl mb-4">Rezept nicht gefunden</h1>
            <Link to="/rezepte" className="btn-primary">
              Zurück zu allen Rezepten
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh]">
          <img
            src={recipe.image_url || '/placeholder.svg'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
          
          {/* Back Button */}
          <Link 
            to="/rezepte"
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-md text-sm font-medium hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Link>
        </div>

        {/* Recipe Content */}
        <section className="container mx-auto -mt-32 relative z-10 pb-20">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-8 md:p-12">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wider rounded-sm mb-4">
                {getDisplayCategory(recipe.category)}
              </span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
                {recipe.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
                {recipe.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{recipe.servings} Portionen</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors">
                  <Printer className="w-4 h-4" />
                  Drucken
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors">
                  <Share2 className="w-4 h-4" />
                  Teilen
                </button>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Ingredients */}
              <div className="bg-secondary/30 p-8 md:p-12">
                <h2 className="font-display text-2xl font-medium mb-6">Zutaten</h2>
                {recipe.ingredients.length > 0 ? (
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Keine Zutaten hinterlegt.</p>
                )}
              </div>

              {/* Instructions */}
              <div className="lg:col-span-2 p-8 md:p-12">
                <h2 className="font-display text-2xl font-medium mb-6">Zubereitung</h2>
                {recipe.instructions.length > 0 ? (
                  <ol className="space-y-6">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="pt-1 text-muted-foreground leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground">Keine Anleitung hinterlegt.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="bg-secondary/30 py-16">
            <div className="container mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-8 text-center">
                Das könnte dir auch gefallen
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedRecipes.map((r) => (
                  <RecipeCard
                    key={r.id}
                    title={r.title}
                    image={r.image_url || '/placeholder.svg'}
                    category={getDisplayCategory(r.category)}
                    time={r.time}
                    servings={r.servings}
                    slug={r.slug}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;