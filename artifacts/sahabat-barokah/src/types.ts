export interface UserProfile {
  id: number;
  name: string;
  email: string;
  plan: "free" | "pro" | "business";
  role: "user" | "admin";
  createdAt: string;
  dailyUsage: number;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface Generation {
  id: number;
  tool: string;
  input: Record<string, any>;
  result: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  todayGenerations: number;
  freeUsers: number;
  proUsers: number;
  businessUsers: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  plan: "free" | "pro" | "business";
  role: "user" | "admin";
  createdAt: string;
  totalGenerations: number;
}

export interface AnalyticsData {
  dailyUsage: { date: string; count: number }[];
  toolUsage: { tool: string; count: number }[];
  userGrowth: { date: string; count: number }[];
}
