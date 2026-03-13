import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useMarketingGenerator } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Loader2 } from "lucide-react";

export default function MarketingFeature() {
  const [result, setResult] = useState<string>("");
  const { register, handleSubmit } = useForm();
  const generate = useMarketingGenerator();

  const onSubmit = (data: any) => {
    generate.mutate(data, {
      onSuccess: (res: any) => setResult(res.result),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Megaphone className="text-primary w-8 h-8" />
          Marketing AI
        </h1>
        <p className="text-muted-foreground mt-2">Buat caption Instagram, WhatsApp broadcast, atau materi promosi menarik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-4 h-fit border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Detail Promosi</CardTitle>
            <CardDescription>Ceritakan apa yang ingin dipromosikan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Produk / Layanan</Label>
                <Input placeholder="Cth: Hampers Kue Kering Lebaran" {...register("productName", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Platform / Jenis Promosi</Label>
                <Input placeholder="Cth: Caption Instagram, Status WA" {...register("promotionType", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input placeholder="Cth: Pekerja kantoran, Emak-emak" {...register("targetAudience", { required: true })} />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={generate.isPending}>
                {generate.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menulis Copy...</> : "Buat Konten"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 min-h-[400px] flex flex-col">
          <CardHeader className="border-b border-border/50 bg-accent/30">
            <CardTitle className="text-xl">Hasil Copywriting</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto max-h-[600px]">
            {generate.isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Menciptakan kalimat yang memancing pembeli...</p>
              </div>
            ) : result ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center py-20 opacity-50">
                Teks promosi siap pakai akan tampil di sini.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
