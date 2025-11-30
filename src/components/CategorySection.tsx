import { Link } from "react-router-dom";
import { Utensils, Cake, Leaf, Timer } from "lucide-react";

const categories = [
  {
    icon: Utensils,
    title: "Hauptgerichte",
    description: "Sättigende Gerichte für die ganze Familie",
    count: 24,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Cake,
    title: "Desserts",
    description: "Süße Verführungen für jeden Anlass",
    count: 18,
    color: "bg-soft-peach text-golden-brown",
  },
  {
    icon: Leaf,
    title: "Vegetarisch",
    description: "Fleischlose Genüsse voller Geschmack",
    count: 15,
    color: "bg-sage-green/10 text-sage-green",
  },
  {
    icon: Timer,
    title: "Schnelle Küche",
    description: "Fertig in unter 30 Minuten",
    count: 21,
    color: "bg-golden-brown/10 text-golden-brown",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title mx-auto">Kategorien</h2>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Finde das perfekte Rezept für jeden Anlass – von schnellen Alltagsgerichten 
            bis hin zu besonderen Desserts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              to="/kategorien"
              className="group bg-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                {category.description}
              </p>
              <span className="text-xs font-medium text-primary">
                {category.count} Rezepte →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
