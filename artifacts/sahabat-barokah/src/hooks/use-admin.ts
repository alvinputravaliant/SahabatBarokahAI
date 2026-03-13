import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { AdminStats, AdminUser, AnalyticsData } from "../types";
import { useToast } from "./use-toast";

export function useAdminStats() {
  return useQuery({
    queryKey: ["/admin/stats"],
    queryFn: () => fetchApi<AdminStats>("/admin/stats"),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["/admin/users"],
    queryFn: () => fetchApi<AdminUser[]>("/admin/users"),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["/admin/analytics"],
    queryFn: () => fetchApi<AnalyticsData>("/admin/analytics"),
  });
}

export function useUpdateUserPlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, plan }: { id: number; plan: string }) => 
      fetchApi<{message: string}>(`/admin/users/${id}/plan`, {
        method: "PATCH",
        body: JSON.stringify({ plan }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/admin/stats"] });
      toast({
        title: "Plan Diperbarui",
        description: "Plan pengguna berhasil diubah.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Gagal memperbarui",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
