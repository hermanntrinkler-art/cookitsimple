import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Rezepte from "./pages/Rezepte";
import RecipeDetail from "./pages/RecipeDetail";
import Kategorien from "./pages/Kategorien";
import UeberMich from "./pages/UeberMich";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminRecipeForm from "./pages/AdminRecipeForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rezepte" element={<Rezepte />} />
            <Route path="/rezept/:slug" element={<RecipeDetail />} />
            <Route path="/kategorien" element={<Kategorien />} />
            <Route path="/ueber-mich" element={<UeberMich />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/rezept/:id" element={<AdminRecipeForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
