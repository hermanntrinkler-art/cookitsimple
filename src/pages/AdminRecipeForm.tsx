import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

const categories = ["Hauptgerichte", "Desserts", "Leichte Küche", "Frühstück", "Suppen", "Snacks"];
const difficulties = ["Einfach", "Mittel", "Anspruchsvoll"];

export default function AdminRecipeForm() {
  const { id } = useParams();
  const isNew = id === "neu";
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    image_url: "",
    category: "Hauptgerichte",
    time: "",
    servings: 4,
    difficulty: "Mittel",
    ingredients: [""],
    instructions: [""],
    featured: false,
    published: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isNew && id && isAdmin) {
      fetchRecipe();
    }
  }, [id, isNew, isAdmin]);

  const fetchRecipe = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Rezept nicht gefunden");
      navigate("/admin");
    } else {
      setForm({
        title: data.title,
        slug: data.slug,
        description: data.description,
        image_url: data.image_url || "",
        category: data.category,
        time: data.time,
        servings: data.servings,
        difficulty: data.difficulty,
        ingredients: data.ingredients.length > 0 ? data.ingredients : [""],
        instructions: data.instructions.length > 0 ? data.instructions : [""],
        featured: data.featured,
        published: data.published,
      });
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: isNew ? generateSlug(value) : prev.slug,
    }));
  };

  const handleArrayChange = (field: "ingredients" | "instructions", index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "ingredients" | "instructions") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "ingredients" | "instructions", index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.slug || !form.description) {
      toast.error("Bitte fülle alle Pflichtfelder aus");
      return;
    }

    setSaving(true);

    const recipeData = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      image_url: form.image_url || null,
      category: form.category,
      time: form.time,
      servings: form.servings,
      difficulty: form.difficulty,
      ingredients: form.ingredients.filter((i) => i.trim()),
      instructions: form.instructions.filter((i) => i.trim()),
      featured: form.featured,
      published: form.published,
      author_id: user?.id,
    };

    try {
      if (isNew) {
        const { error } = await supabase.from("recipes").insert(recipeData);
        if (error) throw error;
        toast.success("Rezept erstellt!");
      } else {
        const { error } = await supabase.from("recipes").update(recipeData).eq("id", id);
        if (error) throw error;
        toast.success("Rezept aktualisiert!");
      }
      navigate("/admin");
    } catch (error: any) {
      if (error.message.includes("duplicate key")) {
        toast.error("Ein Rezept mit diesem Slug existiert bereits");
      } else {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-serif mb-8">
          {isNew ? "Neues Rezept" : "Rezept bearbeiten"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grunddaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="z.B. Cremiges Pilz-Risotto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL-Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="cremiges-pilz-risotto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Eine kurze, appetitliche Beschreibung..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Bild-URL</Label>
                <Input
                  id="image_url"
                  value={form.image_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategorie</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Schwierigkeit</Label>
                  <Select
                    value={form.difficulty}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Zubereitungszeit</Label>
                  <Input
                    id="time"
                    value={form.time}
                    onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                    placeholder="z.B. 40 Min"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Portionen</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={form.servings}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, servings: parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zutaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {form.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                    placeholder="z.B. 300g Arborio-Reis"
                  />
                  {form.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("ingredients", index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem("ingredients")}>
                <Plus className="w-4 h-4 mr-2" />
                Zutat hinzufügen
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zubereitung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {form.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex items-center justify-center w-8 h-10 text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Textarea
                    value={instruction}
                    onChange={(e) => handleArrayChange("instructions", index, e.target.value)}
                    placeholder="Schritt beschreiben..."
                    rows={2}
                    className="flex-1"
                  />
                  {form.instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("instructions", index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem("instructions")}>
                <Plus className="w-4 h-4 mr-2" />
                Schritt hinzufügen
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Veröffentlichung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Veröffentlicht</Label>
                  <p className="text-sm text-muted-foreground">Rezept ist auf der Website sichtbar</p>
                </div>
                <Switch
                  checked={form.published}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">Auf der Startseite hervorheben</p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, featured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Speichern..." : "Speichern"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
              Abbrechen
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
