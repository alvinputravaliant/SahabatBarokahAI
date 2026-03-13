import React from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import StrategyFeature from "@/pages/features/strategy";
import MenuFeature from "@/pages/features/menu";
import ProfitFeature from "@/pages/features/profit";
import MarketingFeature from "@/pages/features/marketing";
import HistoryPage from "@/pages/history";
import Pricing from "@/pages/pricing";
import Billing from "@/pages/billing";
import AdminDashboard from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isLoading) {
      setLocation(user ? "/dashboard" : "/login");
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/features/strategy"><ProtectedRoute component={StrategyFeature} /></Route>
      <Route path="/features/menu"><ProtectedRoute component={MenuFeature} /></Route>
      <Route path="/features/profit"><ProtectedRoute component={ProfitFeature} /></Route>
      <Route path="/features/marketing"><ProtectedRoute component={MarketingFeature} /></Route>
      <Route path="/history"><ProtectedRoute component={HistoryPage} /></Route>
      <Route path="/pricing"><ProtectedRoute component={Pricing} /></Route>
      <Route path="/billing"><ProtectedRoute component={Billing} /></Route>
      <Route path="/admin"><ProtectedRoute component={AdminDashboard} /></Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
