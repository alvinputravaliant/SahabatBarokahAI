import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useHistory } from "@/hooks/use-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, UtensilsCrossed, Calculator, Megaphone, ArrowRight, Zap, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOOLS = [
  { id: "strategy", name: "Strategy AI", icon: Lightbulb, desc: "Rencana bisnis Ramadan", path: "/features/strategy", color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "menu", name: "Menu Viral", icon: UtensilsCrossed, desc: "Ide makanan trending", path: "/features/menu", color: "text-rose-400", bg: "bg-rose-400/10" },
  { id: "profit", name: "Kalkulator Profit", icon: Calculator, desc: "Analisa keuntungan", path: "/features/profit", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "marketing", name: "Marketing AI", icon: Megaphone, desc: "Konten promosi jitu", path: "/features/marketing", color: "text-blue-400", bg: "bg-blue-400/10" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: history } = useHistory();

  const recentHistory = history?.slice(0, 3) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Ahlan wa Sahlan, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Semoga bisnis Anda makin berkah di bulan suci ini.</p>
        </div>
        
        <Card className="bg-gradient-to-br from-card to-accent border-primary/20 w-full md:w-auto">
          <CardContent className="p-4 flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status Plan</p>
              <Badge variant={user?.plan === 'free' ? 'secondary' : 'gold'} className="capitalize text-sm px-3">
                {user?.plan}
              </Badge>
            </div>
            {user?.plan === 'free' && (
              <div className="pl-4 border-l border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Limit Harian</p>
                <p className="font-bold text-foreground">{user?.dailyUsage} / 5</p>
              </div>
            )}
            {user?.plan === 'free' && (
              <Button asChild size="sm" variant="outline" className="ml-2">
                <Link href="/pricing">Upgrade <Zap className="w-3 h-3 ml-1" /></Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Alat Bisnis AI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.path}>
              <Card className="hover-elevate cursor-pointer h-full border-transparent hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{tool.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Mulai <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Riwayat Terakhir</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/history">Lihat Semua</Link>
          </Button>
        </div>

        {recentHistory.length === 0 ? (
          <Card className="bg-accent/50 border-dashed">
            <CardContent className="p-8 text-center">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">Belum ada riwayat generasi.</p>
              <p className="text-sm text-muted-foreground mt-1">Coba salah satu alat AI di atas untuk memulai!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentHistory.map((item) => {
              const tool = TOOLS.find(t => t.name === item.tool) || TOOLS[0];
              return (
                <Card key={item.id} className="bg-card/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <tool.icon className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">{item.tool}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {Object.values(item.input)[0]}
                    </p>
                    <p className="text-xs text-muted-foreground opacity-50">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
