import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

const UeberMich = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <span className="text-primary text-sm font-medium uppercase tracking-widest mb-4 block">
                  Hallo, ich bin
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
                  Die Person hinter<br />
                  <span className="italic text-primary">cookitsimple</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Kochen war schon immer meine große Leidenschaft. Seit über 10 Jahren 
                  experimentiere ich in der Küche und teile meine Lieblingsrezepte mit euch.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Meine Mission: Zeigen, dass leckeres Essen nicht kompliziert sein muss. 
                  Mit einfachen Zutaten und klaren Anleitungen kann jeder köstliche Gerichte 
                  zaubern – auch nach einem langen Arbeitstag.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="relative animate-scale-in">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-sage-green/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <span className="font-display text-6xl text-primary/30">👨‍🍳</span>
                    <p className="text-muted-foreground mt-4">Dein Foodblogger</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-sage-green/10 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto">
            <h2 className="section-title text-center mx-auto mb-12">Meine Kochphilosophie</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥄</span>
                </div>
                <h3 className="font-display text-xl font-medium mb-3">Einfach</h3>
                <p className="text-muted-foreground text-sm">
                  Keine komplizierten Techniken. Meine Rezepte sind für jeden nachkochbar.
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-sage-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥬</span>
                </div>
                <h3 className="font-display text-xl font-medium mb-3">Frisch</h3>
                <p className="text-muted-foreground text-sm">
                  Saisonale Zutaten und frische Produkte sind das Geheimnis guten Geschmacks.
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-golden-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="font-display text-xl font-medium mb-3">Mit Liebe</h3>
                <p className="text-muted-foreground text-sm">
                  Jedes Rezept wird mit Hingabe entwickelt und mehrfach getestet.
                </p>
              </div>
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

export default UeberMich;
