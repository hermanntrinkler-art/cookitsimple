import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, LogOut, Home } from "lucide-react";
import { toast } from "sonner";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  created_at: string;
}

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchRecipes();
    }
  }, [user, isAdmin]);

  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("id, title, slug, category, published, featured, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Fehler beim Laden der Rezepte");
    } else {
      setRecipes(data || []);
    }
    setLoadingRecipes(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Möchtest du "${title}" wirklich löschen?`)) return;

    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) {
      toast.error("Fehler beim Löschen");
    } else {
      toast.success("Rezept gelöscht");
      fetchRecipes();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Kein Admin-Zugang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Du hast keine Admin-Rechte. Bitte kontaktiere den Administrator.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Zur Startseite
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-2xl text-primary">
              cookitsimple
            </Link>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Website
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Rezepte verwalten</h1>
          <Button asChild>
            <Link to="/admin/rezept/neu">
              <Plus className="w-4 h-4 mr-2" />
              Neues Rezept
            </Link>
          </Button>
        </div>

        {loadingRecipes ? (
          <p>Rezepte werden geladen...</p>
        ) : recipes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Noch keine Rezepte vorhanden</p>
              <Button asChild>
                <Link to="/admin/rezept/neu">
                  <Plus className="w-4 h-4 mr-2" />
                  Erstes Rezept erstellen
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium">{recipe.title}</h3>
                      <p className="text-sm text-muted-foreground">{recipe.category}</p>
                    </div>
                    <div className="flex gap-2">
                      {recipe.featured && <Badge>Featured</Badge>}
                      {!recipe.published && <Badge variant="outline">Entwurf</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/rezept/${recipe.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/rezept/${recipe.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(recipe.id, recipe.title)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
