import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/data/recipes";

const Rezepte = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Alle Rezepte
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Entdecke unsere Sammlung einfacher und leckerer Rezepte – 
              von herzhaften Hauptgerichten bis zu süßen Desserts.
            </p>
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <div 
                  key={recipe.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
      </main>

      <Footer />
    </div>
  );
};

export default Rezepte;
