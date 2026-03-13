import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminStats, useAdminUsers, useAdminAnalytics, useUpdateUserPlan } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Users, Activity, Loader2 } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#FDE047', '#34D399', '#F87171', '#60A5FA'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const updatePlan = useUpdateUserPlan();

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p className="text-muted-foreground mt-2">Halaman ini hanya untuk Administrator.</p>
      </div>
    );
  }

  const isLoading = statsLoading || usersLoading || analyticsLoading;

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Activity className="text-primary w-8 h-8" />
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Pengguna</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats?.totalUsers}</p></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Generasi AI</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-primary">{stats?.totalGenerations}</p></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Generasi Hari Ini</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-emerald-400">{stats?.todayGenerations}</p></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Distribusi Plan</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Badge variant="outline" className="text-xs">F: {stats?.freeUsers}</Badge>
            <Badge variant="gold" className="text-xs">P: {stats?.proUsers}</Badge>
            <Badge variant="default" className="text-xs">B: {stats?.businessUsers}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pertumbuhan Pengguna (7 Hari)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="#FDE047" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penggunaan Tools AI</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.toolUsage || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="tool"
                >
                  {(analytics?.toolUsage || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Manajemen Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-accent/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">ID</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Generasi</th>
                  <th className="px-4 py-3 rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-accent/20">
                    <td className="px-4 py-3 font-medium">#{u.id}</td>
                    <td className="px-4 py-3">{u.name} {u.role === 'admin' && <Badge variant="destructive" className="ml-2 text-[10px]">Admin</Badge>}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <select 
                        className="bg-background border border-border rounded px-2 py-1 text-xs outline-none focus:border-primary cursor-pointer"
                        value={u.plan}
                        onChange={(e) => updatePlan.mutate({ id: u.id, plan: e.target.value })}
                        disabled={updatePlan.isPending}
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="business">Business</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{u.totalGenerations}</td>
                    <td className="px-4 py-3">
                      {/* Placeholders for edit/delete */}
                      <Button variant="outline" size="sm" className="h-7 text-xs">Detail</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
