import React, { useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle2, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Billing() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if returning from payment success
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      toast({
        title: "Pembayaran Berhasil!",
        description: "Terima kasih telah melakukan pembayaran. Akun Anda sedang diverifikasi.",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/billing');
    }
  }, [toast]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Settings className="text-primary w-8 h-8" />
          Pengaturan Langganan
        </h1>
        <p className="text-muted-foreground mt-2">Kelola paket dan tagihan akun SahabatBarokah Anda.</p>
      </div>

      <Card className="border-primary/20 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Plan Anda Saat Ini</CardTitle>
          <CardDescription>Informasi status akun</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg capitalize">{user?.plan} Plan</h3>
                <p className="text-sm text-muted-foreground">Bergabung sejak {user ? formatDate(user.createdAt) : '-'}</p>
              </div>
            </div>
            <Badge variant="gold" className="text-sm px-4 py-1">Aktif</Badge>
          </div>

          {user?.plan === 'free' && (
            <div className="bg-gradient-to-r from-card to-secondary p-6 rounded-xl border border-border">
              <h3 className="font-bold mb-2 text-foreground">Butuh lebih banyak fitur?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Dapatkan akses generasi tanpa batas dan prioritas layanan dengan upgrade ke Pro.
              </p>
              <Button asChild>
                <Link href="/pricing">Lihat Pilihan Paket <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
