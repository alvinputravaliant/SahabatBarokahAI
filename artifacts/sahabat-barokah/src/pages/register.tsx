import React from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoonStar } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser, isRegistering } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
    } catch (error) {
      // Error is handled
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      <div className="w-full max-w-md m-auto z-10 px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <MoonStar className="h-10 w-10 text-primary" />
            <span className="font-display font-bold text-3xl gold-gradient-text">SahabatBarokah</span>
          </div>
        </div>

        <Card className="glass-panel border-white/10">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
            <CardDescription>Mulai perjalanan bisnis berkah Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Fulan bin Fulan" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isRegistering}>
                {isRegistering ? "Memproses..." : "Daftar Gratis"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
