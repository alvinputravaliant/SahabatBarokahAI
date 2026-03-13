import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useStrategyGenerator } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, Loader2 } from "lucide-react";

export default function StrategyFeature() {
  const [result, setResult] = useState<string>("");
  const { register, handleSubmit } = useForm();
  
  const generate = useStrategyGenerator();

  const onSubmit = (data: any) => {
    generate.mutate(data, {
      onSuccess: (res: any) => setResult(res.result),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Lightbulb className="text-primary w-8 h-8" />
          Strategy AI
        </h1>
        <p className="text-muted-foreground mt-2">Buat rencana bisnis dan taktik jualan khusus bulan Ramadan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-4 h-fit border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Parameter Bisnis</CardTitle>
            <CardDescription>Masukkan detail usaha Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Usaha</Label>
                <Input placeholder="Cth: Jualan Takjil, Pakaian Muslim..." {...register("businessType", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Target Market</Label>
                <Input placeholder="Cth: Mahasiswa, Ibu Rumah Tangga..." {...register("targetMarket", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Budget / Modal (Rp)</Label>
                <Input type="number" placeholder="500000" {...register("budget", { required: true })} />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={generate.isPending}>
                {generate.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menganalisa...</> : "Buat Strategi"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 min-h-[400px] flex flex-col">
          <CardHeader className="border-b border-border/50 bg-accent/30">
            <CardTitle className="text-xl">Hasil Analisa</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto max-h-[600px]">
            {generate.isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>AI sedang menyusun strategi barokah untuk Anda...</p>
              </div>
            ) : result ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center py-20 opacity-50">
                Isi form di samping untuk mulai menghasilkan strategi bisnis Ramadan Anda.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
