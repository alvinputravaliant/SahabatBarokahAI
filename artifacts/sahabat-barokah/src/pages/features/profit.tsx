import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useProfitGenerator } from "@/hooks/use-ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2 } from "lucide-react";

export default function ProfitFeature() {
  const [result, setResult] = useState<string>("");
  const { register, handleSubmit } = useForm();
  const generate = useProfitGenerator();

  const onSubmit = (data: any) => {
    // Convert strings to numbers for API
    const formattedData = {
      productName: data.productName,
      costPerItem: Number(data.costPerItem),
      sellingPrice: Number(data.sellingPrice),
      estimatedDailySales: Number(data.estimatedDailySales)
    };
    generate.mutate(formattedData, {
      onSuccess: (res: any) => setResult(res.result),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Calculator className="text-primary w-8 h-8" />
          Kalkulator Profit
        </h1>
        <p className="text-muted-foreground mt-2">Analisa HPP dan proyeksi keuntungan harian/bulanan dengan detail.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-4 h-fit border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Data Produk</CardTitle>
            <CardDescription>Masukkan angka estimasi</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Produk</Label>
                <Input placeholder="Cth: Es Pisang Ijo" {...register("productName", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Modal per Porsi/Item (Rp)</Label>
                <Input type="number" placeholder="3000" {...register("costPerItem", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Harga Jual per Porsi (Rp)</Label>
                <Input type="number" placeholder="8000" {...register("sellingPrice", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Estimasi Terjual Sehari</Label>
                <Input type="number" placeholder="50" {...register("estimatedDailySales", { required: true })} />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={generate.isPending}>
                {generate.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menghitung...</> : "Hitung Keuntungan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 min-h-[400px] flex flex-col">
          <CardHeader className="border-b border-border/50 bg-accent/30">
            <CardTitle className="text-xl">Laporan Profit</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto max-h-[600px]">
            {generate.isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Mengkalkulasi modal, BEP, dan proyeksi omzet...</p>
              </div>
            ) : result ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center py-20 opacity-50">
                Laporan keuangan AI akan muncul di sini.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
