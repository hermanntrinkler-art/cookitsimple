import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast({
        title: "Erfolgreich angemeldet!",
        description: "Du erhältst bald die neuesten Rezepte per E-Mail.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-primary-foreground mb-4">
            Verpasse kein Rezept!
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Melde dich für unseren Newsletter an und erhalte jede Woche neue, 
            leckere Rezeptideen direkt in dein Postfach.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-primary-foreground">
              <Check className="w-6 h-6" />
              <span className="font-medium">Danke für deine Anmeldung!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 rounded-md bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-foreground text-primary-foreground rounded-md font-medium hover:bg-foreground/90 transition-colors"
              >
                Anmelden
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
