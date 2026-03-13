import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { Generation } from "../types";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth";

interface GenOptions {
  endpoint: string;
  onSuccess?: () => void;
}

function useAIGenerator<TInput>(options: GenOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: TInput) => 
      fetchApi<Generation>(options.endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/history"] });
      queryClient.invalidateQueries({ queryKey: ["/auth/me"] });
      
      // Warn if getting close to limit
      if (user?.plan === 'free' && user.dailyUsage === 3) {
        toast({
          title: "Peringatan Limit",
          description: "Anda hanya memiliki 1 sisa generasi hari ini. Upgrade ke Pro untuk akses tanpa batas.",
          variant: "destructive",
        });
      }
      
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal memproses",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useStrategyGenerator() {
  return useAIGenerator<Record<string, string>>({ endpoint: "/ai/strategy" });
}

export function useMenuGenerator() {
  return useAIGenerator<Record<string, string>>({ endpoint: "/ai/menu" });
}

export function useProfitGenerator() {
  return useAIGenerator<Record<string, any>>({ endpoint: "/ai/profit" });
}

export function useMarketingGenerator() {
  return useAIGenerator<Record<string, string>>({ endpoint: "/ai/marketing" });
}
