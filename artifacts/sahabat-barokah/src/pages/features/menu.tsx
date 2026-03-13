import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useMenuGenerator } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Loader2 } from "lucide-react";

export default function MenuFeature() {
  const [result, setResult] = useState<string>("");
  const { register, handleSubmit } = useForm();
  const generate = useMenuGenerator();

  const onSubmit = (data: any) => {
    generate.mutate(data, {
      onSuccess: (res: any) => setResult(res.result),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <UtensilsCrossed className="text-primary w-8 h-8" />
          Menu Viral AI
        </h1>
        <p className="text-muted-foreground mt-2">Dapatkan ide menu takjil atau buka puasa yang unik dan berpotensi viral.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-4 h-fit border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Kriteria Menu</CardTitle>
            <CardDescription>Sesuaikan dengan keahlian Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Makanan/Minuman</Label>
                <Input placeholder="Cth: Minuman segar, Gorengan..." {...register("foodType", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Target Pelanggan</Label>
                <Input placeholder="Cth: Anak muda, Keluarga..." {...register("targetCustomer", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Rentang Harga Jual (Rp)</Label>
                <Input placeholder="Cth: 5000 - 15000" {...register("priceRange", { required: true })} />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={generate.isPending}>
                {generate.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Meracik Ide...</> : "Cari Ide Menu"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 min-h-[400px] flex flex-col">
          <CardHeader className="border-b border-border/50 bg-accent/30">
            <CardTitle className="text-xl">Hasil Rekomendasi Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto max-h-[600px]">
            {generate.isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Mencari kombinasi menu yang paling menarik...</p>
              </div>
            ) : result ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center py-20 opacity-50">
                Hasil akan muncul di sini.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
