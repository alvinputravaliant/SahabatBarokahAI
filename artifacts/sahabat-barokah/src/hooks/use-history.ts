import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { Generation } from "../types";
import { useToast } from "./use-toast";

export function useHistory() {
  return useQuery({
    queryKey: ["/history"],
    queryFn: () => fetchApi<Generation[]>("/history"),
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => 
      fetchApi<{message: string}>(`/history/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/history"] });
      toast({
        title: "Berhasil",
        description: "Riwayat telah dihapus.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Gagal menghapus",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
