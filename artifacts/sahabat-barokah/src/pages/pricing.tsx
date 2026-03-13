import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: 0,
    desc: "Cocok untuk mencoba dan merintis",
    features: ["5x Generasi AI per hari", "Akses 4 Tools Dasar", "Riwayat tersimpan 7 hari", "Standard Support"],
    action: "Plan Saat Ini",
    id: "free"
  },
  {
    name: "Pro",
    price: 49000,
    desc: "Bebas berkreasi untuk UMKM serius",
    features: ["Generasi AI Unlimited", "Prioritas kecepatan proses", "Riwayat tersimpan selamanya", "Download hasil PDF", "Premium Support"],
    action: "Upgrade ke Pro",
    id: "pro",
    highlight: true,
    link: "https://mayar.to/alvin-the-chipmunk"
  },
  {
    name: "Business",
    price: 99000,
    desc: "Untuk agensi atau multi-bisnis",
    features: ["Semua fitur Pro", "Akses API (Coming Soon)", "Custom Branding Laporan", "1-on-1 Business Consult"],
    action: "Pilih Business",
    id: "business",
    link: "https://mayar.to/alvin-the-chipmunk"
  }
];

export default function Pricing() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto py-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-display flex justify-center items-center gap-3">
          <CreditCard className="text-primary w-10 h-10" />
          Investasi Barokah
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">Pilih paket yang sesuai dengan kebutuhan skala bisnis Anda di bulan suci ini. Tingkatkan omzet dengan bantuan AI tanpa batas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col ${plan.highlight ? 'border-primary shadow-primary/20 shadow-2xl scale-105 z-10' : ''}`}>
            {plan.highlight && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Paling Laris
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
              <CardDescription>{plan.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                <span className="text-muted-foreground">/bln</span>
              </div>
              <ul className="space-y-3 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.highlight ? "default" : "outline"} 
                className="w-full"
                disabled={user?.plan === plan.id}
                onClick={() => {
                  if (plan.link && user?.plan !== plan.id) {
                    window.location.href = plan.link;
                  }
                }}
              >
                {user?.plan === plan.id ? "Plan Aktif" : plan.action}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-12">
        Pembayaran diproses secara aman menggunakan sistem Mayar. Setelah pembayaran sukses, akun akan diverifikasi otomatis.
      </p>
    </div>
  );
}
