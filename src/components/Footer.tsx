import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold text-primary">
                cook<span className="text-sage-green">it</span>simple
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              Einfache und leckere Rezepte für jeden Tag. Kochen muss nicht kompliziert sein – 
              mit den richtigen Tipps und Tricks gelingt jedes Gericht.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-background rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Rezepte</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/rezepte" className="hover:text-primary transition-colors">Alle Rezepte</Link></li>
              <li><Link to="/rezepte" className="hover:text-primary transition-colors">Hauptgerichte</Link></li>
              <li><Link to="/rezepte" className="hover:text-primary transition-colors">Desserts</Link></li>
              <li><Link to="/rezepte" className="hover:text-primary transition-colors">Schnelle Küche</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-4">Mehr</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/ueber-mich" className="hover:text-primary transition-colors">Über mich</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Newsletter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Datenschutz</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} cookitsimple. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
