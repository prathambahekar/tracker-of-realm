import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import System from "./pages/System";
import Apps from "./pages/Apps";
import Data from "./pages/Data";
import Analytics from "./pages/Analytics";
import Tracker from "./pages/Tracker";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/system" element={<System />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/data" element={<Data />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
createRoot(rootElement).render(<App />);
