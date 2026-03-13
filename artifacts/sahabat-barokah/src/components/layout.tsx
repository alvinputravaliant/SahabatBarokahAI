import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Lightbulb, 
  UtensilsCrossed, 
  Calculator, 
  Megaphone, 
  History, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu as MenuIcon,
  X,
  MoonStar
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/features/strategy", label: "Strategy AI", icon: Lightbulb },
  { href: "/features/menu", label: "Menu Viral", icon: UtensilsCrossed },
  { href: "/features/profit", label: "Kalkulator Profit", icon: Calculator },
  { href: "/features/marketing", label: "Marketing AI", icon: Megaphone },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/pricing", label: "Harga", icon: CreditCard },
  { href: "/billing", label: "Langganan", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [...NAV_ITEMS];
  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: "Admin Panel", icon: Settings });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-md z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <MoonStar className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg gold-gradient-text">SahabatBarokah</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <MenuIcon />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-72 bg-card border-r border-border/50 p-6 flex flex-col z-40 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center gap-3 mb-10 pl-2">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl gold-gradient-text">SahabatBarokah</span>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.plan} plan</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 relative">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
