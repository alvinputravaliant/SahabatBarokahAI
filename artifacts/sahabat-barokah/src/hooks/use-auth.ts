import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "../lib/api";
import { AuthResponse, UserProfile } from "../types";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/auth/me"],
    queryFn: () => fetchApi<UserProfile>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: Record<string, string>) => 
      fetchApi<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      localStorage.setItem("sahabat_token", data.token);
      queryClient.setQueryData(["/auth/me"], data.user);
      setLocation("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: Record<string, string>) => 
      fetchApi<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    onSuccess: (data) => {
      localStorage.setItem("sahabat_token", data.token);
      queryClient.setQueryData(["/auth/me"], data.user);
      setLocation("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => fetchApi<{message: string}>("/auth/logout", { method: "POST" }),
    onSettled: () => {
      localStorage.removeItem("sahabat_token");
      queryClient.setQueryData(["/auth/me"], null);
      queryClient.clear();
      setLocation("/login");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
