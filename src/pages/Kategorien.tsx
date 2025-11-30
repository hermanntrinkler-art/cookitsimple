import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/data/recipes";
import { Utensils, Cake, Leaf, Timer } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "alle", label: "Alle Rezepte", icon: null },
  { id: "Hauptgerichte", label: "Hauptgerichte", icon: Utensils },
  { id: "Desserts", label: "Desserts", icon: Cake },
  { id: "Leichte Küche", label: "Leichte Küche", icon: Leaf },
];

const Kategorien = () => {
  const [activeCategory, setActiveCategory] = useState("alle");

  const filteredRecipes = activeCategory === "alle" 
    ? recipes 
    : recipes.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Kategorien
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Finde genau das richtige Rezept für deinen Appetit – 
              durchstöbere unsere Kategorien.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-40">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.icon && <cat.icon className="w-4 h-4" />}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="py-16">
          <div className="container mx-auto">
            <p className="text-muted-foreground mb-8">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? "Rezept" : "Rezepte"} gefunden
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe, index) => (
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

export default Kategorien;
