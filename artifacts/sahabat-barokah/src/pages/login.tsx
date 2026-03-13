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

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password dibutuhkan"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled by global fetch or could be set to form
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      {/* Background pattern */}
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
            <CardTitle className="text-2xl">Selamat Datang Kembali</CardTitle>
            <CardDescription>Masuk untuk mengelola bisnis Ramadan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Memproses..." : "Masuk"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
