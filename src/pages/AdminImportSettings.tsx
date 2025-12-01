import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, RefreshCw, Home, LogOut, Clock, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface ImportSettings {
  id: string;
  enabled: boolean;
  frequency: string;
  import_hour: number;
  last_import_at: string | null;
  next_import_at: string | null;
}

interface ImportedRecipe {
  id: string;
  source_recipe_id: string;
  local_recipe_id: string | null;
  imported_at: string;
  raw_data: any;
}

export default function AdminImportSettings() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ImportSettings | null>(null);
  const [imports, setImports] = useState<ImportedRecipe[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSettings();
      fetchImports();
    }
  }, [user, isAdmin]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("import_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast.error("Fehler beim Laden der Einstellungen");
    } else {
      setSettings(data);
    }
    setLoadingSettings(false);
  };

  const fetchImports = async () => {
    const { data, error } = await supabase
      .from("imported_recipes")
      .select("*")
      .order("imported_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setImports(data);
      setImportCount(data.length);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("import_settings")
      .update({
        enabled: settings.enabled,
        frequency: settings.frequency,
        import_hour: settings.import_hour,
      })
      .eq("id", settings.id);

    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success("Einstellungen gespeichert");
    }
    setSaving(false);
  };

  const handleManualImport = async () => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-recipe", {
        body: { force: true },
      });

      if (error) {
        toast.error(`Import fehlgeschlagen: ${error.message}`);
      } else if (data.success) {
        toast.success(`Rezept importiert: ${data.recipe?.title}`);
        fetchImports();
        fetchSettings();
      } else {
        toast.info(data.message || "Kein Rezept verfügbar");
      }
    } catch (err) {
      toast.error("Import fehlgeschlagen");
    }
    setImporting(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Nie";
    return new Date(dateStr).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const frequencyLabels: Record<string, string> = {
    daily: "Täglich",
    every_2_days: "Alle 2 Tage",
    weekly: "Wöchentlich",
  };

  if (loading || loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laden...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Kein Admin-Zugang</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/")}>
              Zur Startseite
            </Button>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Link>
          </Button>
          <h1 className="text-3xl font-serif">Rezept-Import</h1>
          <p className="text-muted-foreground mt-2">
            Automatischer Import von Rezepten aus Recipe Pixie
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Letzter Import</p>
                  <p className="font-medium">{formatDate(settings?.last_import_at || null)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nächster Import</p>
                  <p className="font-medium">
                    {settings?.enabled ? formatDate(settings?.next_import_at || null) : "Deaktiviert"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Importierte Rezepte</p>
                  <p className="font-medium">{importCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Einstellungen
              </CardTitle>
              <CardDescription>
                Konfiguriere den automatischen Import von Rezepten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enabled">Automatischer Import</Label>
                      <p className="text-sm text-muted-foreground">
                        Rezepte werden automatisch importiert
                      </p>
                    </div>
                    <Switch
                      id="enabled"
                      checked={settings.enabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enabled: checked })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Häufigkeit</Label>
                      <Select
                        value={settings.frequency}
                        onValueChange={(value) =>
                          setSettings({ ...settings, frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Täglich</SelectItem>
                          <SelectItem value="every_2_days">Alle 2 Tage</SelectItem>
                          <SelectItem value="weekly">Wöchentlich</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hour">Uhrzeit</Label>
                      <Select
                        value={settings.import_hour.toString()}
                        onValueChange={(value) =>
                          setSettings({ ...settings, import_hour: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}:00 Uhr
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Speichern..." : "Einstellungen speichern"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Manual Import Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Manueller Import
              </CardTitle>
              <CardDescription>
                Importiere jetzt ein Rezept aus Recipe Pixie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleManualImport} disabled={importing}>
                {importing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Importiere...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Jetzt importieren
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Import History */}
          {imports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Import-Historie</CardTitle>
                <CardDescription>Die letzten {imports.length} importierten Rezepte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {imports.map((imp) => (
                    <div
                      key={imp.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {imp.local_recipe_id ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {imp.raw_data?.title || "Unbekanntes Rezept"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(imp.imported_at)}
                          </p>
                        </div>
                      </div>
                      {imp.local_recipe_id && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/rezept/${imp.raw_data?.slug || imp.local_recipe_id}`}>
                            Ansehen
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
