import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import RecipeCard from "@/components/RecipeCard";
import CategorySection from "@/components/CategorySection";
import NewsletterSection from "@/components/NewsletterSection";
import { recipes } from "@/data/recipes";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredRecipe = recipes[0];
  const latestRecipes = recipes.slice(1, 5);

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecipeCard
                title={featuredRecipe.title}
                image={featuredRecipe.image}
                category={featuredRecipe.category}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard
                    title={recipe.title}
                    image={recipe.image}
                    category={recipe.category}
                    time={recipe.time}
                    servings={recipe.servings}
                    slug={recipe.slug}
                  />
                </div>
              ))}
            </div>
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
