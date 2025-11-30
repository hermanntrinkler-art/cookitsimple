import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Frisch gebackenes Brot mit Olivenöl und frischen Kräutern"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block text-soft-peach text-sm font-medium uppercase tracking-widest mb-4 animate-fade-in">
            Willkommen bei cookitsimple
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-primary-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Einfache Rezepte<br />
            <span className="italic">für jeden Tag</span>
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Entdecke köstliche Gerichte, die gelingen – ohne komplizierte Zutaten 
            oder stundenlanges Kochen. Einfach lecker!
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/rezepte" 
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Alle Rezepte entdecken
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/ueber-mich" 
              className="btn-secondary bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
            >
              Über mich
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
