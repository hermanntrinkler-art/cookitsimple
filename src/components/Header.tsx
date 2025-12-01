import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Startseite", href: "/" },
  { label: "Rezepte", href: "/rezepte" },
  { label: "Kategorien", href: "/kategorien" },
  { label: "Über mich", href: "/ueber-mich" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-32 md:h-36">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="cookitsimple Logo" 
              className="h-40 md:h-48 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="nav-link font-medium text-sm uppercase tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search, Login & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-foreground/70 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to={user ? (isAdmin ? "/admin" : "/auth") : "/auth"}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              title={user ? "Admin-Bereich" : "Anmelden"}
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
