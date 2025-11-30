import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  title: string;
  image: string;
  category: string;
  time: string;
  servings: number;
  slug: string;
  featured?: boolean;
}

const RecipeCard = ({ title, image, category, time, servings, slug, featured = false }: RecipeCardProps) => {
  if (featured) {
    return (
      <Link to={`/rezept/${slug}`} className="group block">
        <article className="recipe-card h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wider rounded-sm mb-3">
                {category}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{title}</h3>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {servings} Portionen
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/rezept/${slug}`} className="group block">
      <article className="recipe-card h-full">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-primary mb-2 block">
            {category}
          </span>
          <h3 className="font-display text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {servings}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default RecipeCard;
