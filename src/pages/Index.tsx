import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import RecipeCard from "@/components/RecipeCard";
import CategorySection from "@/components/CategorySection";
import NewsletterSection from "@/components/NewsletterSection";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  featured: boolean;
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

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('id, title, slug, description, category, time, servings, difficulty, image_url, featured')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  const featuredRecipe = recipes.find(r => r.featured) || recipes[0];
  const latestRecipes = recipes.filter(r => r.id !== featuredRecipe?.id).slice(0, 4);

  const getDisplayCategory = (category: string) => {
    return categoryMap[category.toLowerCase()] || category;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Recipe */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-widest mb-2 block">
                  Empfohlen
                </span>
                <h2 className="section-title">Rezept der Woche</h2>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground">Lade Rezepte...</div>
            ) : featuredRecipe ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecipeCard
                  title={featuredRecipe.title}
                  image={featuredRecipe.image_url || '/placeholder.svg'}
                  category={getDisplayCategory(featuredRecipe.category)}
                  time={featuredRecipe.time}
                  servings={featuredRecipe.servings}
                  slug={featuredRecipe.slug}
                  featured
                />
                <div className="flex flex-col justify-center lg:pl-8">
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {featuredRecipe.description}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-sm font-medium text-foreground">Schwierigkeit:</span>
                      <span className="text-muted-foreground">{featuredRecipe.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-sm font-medium text-foreground">Zeit:</span>
                      <span className="text-muted-foreground">{featuredRecipe.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-sm font-medium text-foreground">Portionen:</span>
                      <span className="text-muted-foreground">{featuredRecipe.servings} Personen</span>
                    </div>
                  </div>
                  <Link 
                    to={`/rezept/${featuredRecipe.slug}`}
                    className="btn-primary inline-flex items-center gap-2 w-fit group"
                  >
                    Zum Rezept
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Noch keine Rezepte vorhanden.</div>
            )}
          </div>
        </section>

        {/* Categories */}
        <CategorySection />

        {/* Latest Recipes */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-widest mb-2 block">
                  Frisch aus der Küche
                </span>
                <h2 className="section-title">Neueste Rezepte</h2>
              </div>
              <Link 
                to="/rezepte"
                className="text-primary font-medium hover:underline flex items-center gap-1 mt-4 md:mt-0"
              >
                Alle Rezepte
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground">Lade Rezepte...</div>
            ) : latestRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestRecipes.map((recipe, index) => (
                  <div 
                    key={recipe.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <RecipeCard
                      title={recipe.title}
                      image={recipe.image_url || '/placeholder.svg'}
                      category={getDisplayCategory(recipe.category)}
                      time={recipe.time}
                      servings={recipe.servings}
                      slug={recipe.slug}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;