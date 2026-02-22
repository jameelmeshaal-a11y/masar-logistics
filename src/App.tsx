import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Procurement from "./pages/Procurement";
import Fleet from "./pages/Fleet";
import Maintenance from "./pages/Maintenance";
import Warehousing from "./pages/Warehousing";
import Drivers from "./pages/Drivers";
import Tracking from "./pages/Tracking";
import Quality from "./pages/Quality";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Chat from "./pages/Chat";
import UserGuide from "./pages/UserGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/procurement/*" element={<Procurement />} />
            <Route path="/fleet/*" element={<Fleet />} />
            <Route path="/maintenance/*" element={<Maintenance />} />
            <Route path="/warehouse/*" element={<Warehousing />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/finance/*" element={<Finance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/guide" element={<UserGuide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
