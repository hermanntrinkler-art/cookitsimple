import risottoImg from "@/assets/recipe-risotto.jpg";
import chocolateCakeImg from "@/assets/recipe-chocolate-cake.jpg";
import saladImg from "@/assets/recipe-salad.jpg";
import pastaImg from "@/assets/recipe-pasta.jpg";
import stewImg from "@/assets/recipe-stew.jpg";
import chickenImg from "@/assets/recipe-chicken.jpg";

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  time: string;
  servings: number;
  difficulty: "Einfach" | "Mittel" | "Anspruchsvoll";
  ingredients: string[];
  instructions: string[];
  featured?: boolean;
}

export const recipes: Recipe[] = [
  {
    id: "1",
    slug: "cremiges-pilz-risotto",
    title: "Cremiges Pilz-Risotto",
    description: "Ein klassisches italienisches Risotto mit aromatischen Pilzen und frischem Parmesan – cremig, herzhaft und einfach köstlich.",
    image: risottoImg,
    category: "Hauptgerichte",
    time: "40 Min",
    servings: 4,
    difficulty: "Mittel",
    featured: true,
    ingredients: [
      "300g Arborio-Reis",
      "400g gemischte Pilze",
      "1 Zwiebel",
      "2 Knoblauchzehen",
      "150ml Weißwein",
      "1L Gemüsebrühe",
      "80g Parmesan",
      "50g Butter",
      "Frische Petersilie",
      "Salz & Pfeffer",
    ],
    instructions: [
      "Die Brühe in einem Topf erhitzen und warm halten.",
      "Zwiebel und Knoblauch fein würfeln. Pilze putzen und in Scheiben schneiden.",
      "Die Hälfte der Butter in einer Pfanne erhitzen und die Pilze goldbraun anbraten. Beiseitestellen.",
      "Restliche Butter im Topf schmelzen, Zwiebel und Knoblauch glasig dünsten.",
      "Reis hinzufügen und kurz mitrösten, bis er glasig ist.",
      "Mit Weißwein ablöschen und unter Rühren einkochen lassen.",
      "Nach und nach die warme Brühe hinzufügen und unter ständigem Rühren einkochen lassen.",
      "Nach etwa 18-20 Minuten sollte der Reis cremig und noch leicht bissfest sein.",
      "Pilze und geriebenen Parmesan unterheben.",
      "Mit Salz und Pfeffer abschmecken und mit frischer Petersilie servieren.",
    ],
  },
  {
    id: "2",
    slug: "schokoladen-lava-kuchen",
    title: "Schokoladen-Lava-Kuchen",
    description: "Ein sündiges Dessert mit flüssigem Schokoladenkern – perfekt für besondere Anlässe oder wenn du dir etwas Besonderes gönnen möchtest.",
    image: chocolateCakeImg,
    category: "Desserts",
    time: "25 Min",
    servings: 4,
    difficulty: "Mittel",
    ingredients: [
      "200g Zartbitterschokolade",
      "100g Butter",
      "3 Eier",
      "80g Zucker",
      "30g Mehl",
      "1 TL Vanilleextrakt",
      "Prise Salz",
      "Frische Himbeeren zum Servieren",
    ],
    instructions: [
      "Backofen auf 200°C vorheizen. 4 Förmchen einfetten und mit Kakaopulver bestäuben.",
      "Schokolade und Butter über dem Wasserbad schmelzen.",
      "Eier und Zucker schaumig schlagen.",
      "Die geschmolzene Schokolade unterheben.",
      "Mehl, Vanille und Salz vorsichtig unterheben.",
      "Teig auf die Förmchen verteilen.",
      "10-12 Minuten backen – der Rand sollte fest, die Mitte noch weich sein.",
      "5 Minuten ruhen lassen, dann auf Teller stürzen.",
      "Mit frischen Himbeeren servieren.",
    ],
  },
  {
    id: "3",
    slug: "frischer-sommer-salat",
    title: "Frischer Sommer-Salat",
    description: "Ein bunter, erfrischender Salat mit gegrilltem Hähnchen, Avocado und frischem Gemüse – leicht und trotzdem sättigend.",
    image: saladImg,
    category: "Leichte Küche",
    time: "20 Min",
    servings: 2,
    difficulty: "Einfach",
    ingredients: [
      "2 Hähnchenbrustfilets",
      "1 reife Avocado",
      "150g Kirschtomaten",
      "100g Feta",
      "Mixed Greens",
      "Olivenöl",
      "Zitronensaft",
      "Honig",
      "Salz & Pfeffer",
    ],
    instructions: [
      "Hähnchenbrust mit Salz, Pfeffer und Olivenöl würzen.",
      "In einer heißen Pfanne von beiden Seiten goldbraun braten.",
      "Ruhen lassen und in Scheiben schneiden.",
      "Salat waschen und auf Tellern anrichten.",
      "Avocado halbieren, entkernen und in Scheiben schneiden.",
      "Tomaten halbieren, Feta würfeln.",
      "Dressing aus Olivenöl, Zitronensaft, Honig, Salz und Pfeffer mixen.",
      "Alles auf dem Salat anrichten und mit Dressing beträufeln.",
    ],
  },
  {
    id: "4",
    slug: "klassische-spaghetti-carbonara",
    title: "Klassische Spaghetti Carbonara",
    description: "Original italienische Carbonara ohne Sahne – nur mit Ei, Pecorino, Guanciale und schwarzem Pfeffer. Authentisch und unwiderstehlich!",
    image: pastaImg,
    category: "Hauptgerichte",
    time: "25 Min",
    servings: 4,
    difficulty: "Einfach",
    ingredients: [
      "400g Spaghetti",
      "200g Guanciale oder Pancetta",
      "4 Eigelb",
      "100g Pecorino Romano",
      "Schwarzer Pfeffer",
      "Salz",
    ],
    instructions: [
      "Spaghetti in reichlich Salzwasser al dente kochen.",
      "Guanciale in Streifen schneiden und ohne Fett knusprig braten.",
      "Eigelb mit geriebenem Pecorino und reichlich Pfeffer verrühren.",
      "Pasta abgießen, dabei etwas Kochwasser auffangen.",
      "Heiße Pasta zum Guanciale geben, vom Herd nehmen.",
      "Ei-Käse-Mischung unterheben und schnell vermengen.",
      "Bei Bedarf mit Kochwasser cremiger machen.",
      "Sofort servieren mit extra Pecorino und Pfeffer.",
    ],
  },
  {
    id: "5",
    slug: "herzhafter-rinder-schmortopf",
    title: "Herzhafter Rinder-Schmortopf",
    description: "Ein wärmendes Comfort Food mit zartem Rindfleisch, Wurzelgemüse und aromatischen Kräutern – perfekt für kalte Tage.",
    image: stewImg,
    category: "Hauptgerichte",
    time: "2,5 Std",
    servings: 6,
    difficulty: "Mittel",
    ingredients: [
      "800g Rindergulasch",
      "4 Kartoffeln",
      "4 Karotten",
      "2 Zwiebeln",
      "3 Knoblauchzehen",
      "500ml Rinderbrühe",
      "250ml Rotwein",
      "2 EL Tomatenmark",
      "Thymian & Rosmarin",
      "Lorbeerblätter",
    ],
    instructions: [
      "Fleisch in große Würfel schneiden, salzen und pfeffern.",
      "In einem schweren Topf portionsweise scharf anbraten.",
      "Zwiebeln und Knoblauch anbraten, Tomatenmark kurz mitrösten.",
      "Mit Rotwein ablöschen und einkochen lassen.",
      "Fleisch zurückgeben, Brühe und Kräuter hinzufügen.",
      "Bei niedriger Hitze 1,5 Stunden köcheln lassen.",
      "Kartoffeln und Karotten würfeln und hinzufügen.",
      "Weitere 45 Minuten köcheln, bis alles zart ist.",
      "Mit Salz und Pfeffer abschmecken und servieren.",
    ],
  },
  {
    id: "6",
    slug: "knuspriges-zitronen-haehnchen",
    title: "Knuspriges Zitronen-Hähnchen",
    description: "Goldbraun gebratenes Hähnchen mit Zitrone und Rosmarin – außen knusprig, innen saftig. Ein Klassiker für das Sonntagsessen.",
    image: chickenImg,
    category: "Hauptgerichte",
    time: "1,5 Std",
    servings: 4,
    difficulty: "Einfach",
    ingredients: [
      "1 ganzes Hähnchen (ca. 1,5kg)",
      "2 Zitronen",
      "4 Knoblauchzehen",
      "Frischer Rosmarin",
      "Olivenöl",
      "Butter",
      "Kartoffeln",
      "Karotten",
      "Salz & Pfeffer",
    ],
    instructions: [
      "Backofen auf 200°C vorheizen.",
      "Hähnchen waschen, trockentupfen, innen und außen salzen.",
      "Eine Zitrone halbieren und mit Knoblauch und Rosmarin in das Hähnchen füllen.",
      "Mit weicher Butter einreiben und mit Zitronensaft beträufeln.",
      "Kartoffeln und Karotten würfeln, in die Brätform geben.",
      "Hähnchen darauf setzen und mit Olivenöl beträufeln.",
      "60-75 Minuten braten, dabei gelegentlich mit Bratensaft übergießen.",
      "Ruhen lassen und mit dem Gemüse servieren.",
    ],
  },
];

export const getFeaturedRecipes = () => recipes.filter(r => r.featured);
export const getLatestRecipes = (count: number = 6) => recipes.slice(0, count);
export const getRecipeBySlug = (slug: string) => recipes.find(r => r.slug === slug);
