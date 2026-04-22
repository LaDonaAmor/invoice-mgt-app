import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import { ThemeProvider } from "@/context/ThemeContext";
import { InvoiceProvider } from "@/context/InvoiceContext";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InvoiceProvider>
          <TooltipProvider delayDuration={200}>
            {/* Toast systems */}
            <Toaster />
            <Sonner position="top-right" />
            {/* Routing */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </InvoiceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default App;
