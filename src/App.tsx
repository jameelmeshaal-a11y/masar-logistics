import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Procurement from "./pages/Procurement";
import Fleet from "./pages/Fleet";
import Maintenance from "./pages/Maintenance";
import TicketDetails from "./pages/TicketDetails";
import Warehousing from "./pages/Warehousing";
import Drivers from "./pages/Drivers";
import Tracking from "./pages/Tracking";
import Quality from "./pages/Quality";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Chat from "./pages/Chat";
import UserGuide from "./pages/UserGuide";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import UsersManagement from "./pages/UsersManagement";
import ERPNextSettings from "./pages/ERPNextSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/procurement/*" element={<Procurement />} />
                      <Route path="/fleet/*" element={<Fleet />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/maintenance/*" element={<Maintenance />} />
                      <Route path="/maintenance/ticket/:id" element={<TicketDetails />} />
                      <Route path="/warehouse/*" element={<Warehousing />} />
                      <Route path="/drivers" element={<Drivers />} />
                      <Route path="/tracking" element={<Tracking />} />
                      <Route path="/quality" element={<Quality />} />
                      <Route path="/finance/*" element={<Finance />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/guide" element={<UserGuide />} />
                      <Route path="/settings/users" element={<UsersManagement />} />
                      <Route path="/settings/erpnext" element={<ERPNextSettings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
