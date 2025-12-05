import { useEffect, useMemo, useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Users as UsersIcon, Package, BarChart3, LogOut } from "lucide-react";

function useCsrfToken() {
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    let t = localStorage.getItem("admin_csrf");
    if (!t) {
      t = Math.random().toString(36).slice(2);
      localStorage.setItem("admin_csrf", t);
    }
    document.cookie = `csrf_token=${t}; Path=/; SameSite=Strict`;
    setToken(t);
  }, []);
  return token;
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary"><Shield className="h-5 w-5" /><span className="font-semibold">Admin</span></div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
            <Button variant="outline" onClick={async () => { localStorage.removeItem("admin_local_auth"); await supabase.auth.signOut(); navigate("/"); }}>Sair <LogOut className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <nav className="flex gap-3 mb-6">
          <Link to="/admin/users"><Button variant="outline" className="gap-2"><UsersIcon className="h-4 w-4" />Contas</Button></Link>
          <Link to="/admin/products"><Button variant="outline" className="gap-2"><Package className="h-4 w-4" />Produtos</Button></Link>
          <Link to="/admin/analytics"><Button variant="outline" className="gap-2"><BarChart3 className="h-4 w-4" />Análises</Button></Link>
          <Link to="/admin/login"><Button variant="ghost">Login Admin</Button></Link>
        </nav>
        {children}
      </main>
    </div>
  );
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const raw = import.meta.env.VITE_ADMIN_EMAILS || "authgou@gmail.com";
      const admins = raw.split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
      const localRaw = localStorage.getItem("admin_local_auth");
      let localEmail = "";
      try { localEmail = (JSON.parse(localRaw || "null")?.email || "").toLowerCase(); } catch {}
      const expectedLocal = (import.meta.env.VITE_ADMIN_LOCAL_EMAIL || "authgou@gmail.com").toLowerCase();
      const email = (session?.user?.email || "").toLowerCase();
      const isLocalAuth = localEmail === expectedLocal;
      const isAdmin = isLocalAuth || admins.includes(email);
      if (!isAdmin) { navigate("/admin/login"); }
      setAllowed(isAdmin);
    };
    check();
  }, [navigate]);
  if (allowed === null) return (<div className="min-h-[40vh] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>);
  if (!allowed) return (<div className="text-center text-muted-foreground">Acesso negado</div>);
  return <>{children}</>;
};

type UserItem = { id: string; email: string; name?: string | null; role?: string | null; disabled?: boolean };
const UsersPage = () => {
  const csrf = useCsrfToken();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<UserItem[]>([]);
  const load = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      const resp = await fetch("/api/admin/users", { headers: { "x-csrf-token": csrf, "Authorization": token ? `Bearer ${token}` : "" } });
      const data = await resp.json();
      setItems(Array.isArray(data?.users) ? data.users : []);
    } catch { toast.error("Falha ao carregar usuários"); }
  };
  useEffect(() => { if (csrf) load(); }, [csrf]);
  const filtered = useMemo(() => items.filter((u: UserItem) => (u.email || "").toLowerCase().includes(q.toLowerCase())), [items, q]);
  return (
    <Card className="border-primary/20">
      <CardHeader><CardTitle>Contas de Usuário</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label>Buscar</Label>
            <Input placeholder="email" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button onClick={load}>Atualizar</Button>
        </div>
        <div className="divide-y">
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-medium">{u.email}</div>
                <div className="text-muted-foreground">{u.role || "user"}</div>
              </div>
              <div className="flex gap-2"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

type ProductItem = { id: string; name: string; price: number; is_active?: boolean | null; user_id: string; updated_at: string };
const ProductsPage = () => {
  const csrf = useCsrfToken();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<ProductItem[]>([]);
  const load = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      const resp = await fetch("/api/admin/products", { headers: { "x-csrf-token": csrf, "Authorization": token ? `Bearer ${token}` : "" } });
      const data = await resp.json();
      setItems(Array.isArray(data?.products) ? data.products : []);
    } catch { toast.error("Falha ao carregar produtos"); }
  };
  useEffect(() => { if (csrf) load(); }, [csrf]);
  const filtered = useMemo(() => items.filter((p: ProductItem) => (p.name || "").toLowerCase().includes(q.toLowerCase())), [items, q]);
  const remove = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      const resp = await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json", "x-csrf-token": csrf, "Authorization": token ? `Bearer ${token}` : "" }, body: JSON.stringify({ id }) });
      if (!resp.ok) throw new Error();
      toast.success("Produto removido");
      load();
    } catch { toast.error("Falha ao remover"); }
  };
  return (
    <Card className="border-primary/20">
      <CardHeader><CardTitle>Produtos</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label>Buscar</Label>
            <Input placeholder="nome" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Button onClick={load}>Atualizar</Button>
        </div>
        <div className="divide-y">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-muted-foreground">R$ {Number(p.price).toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={() => remove(p.id)}>Remover</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsPage = () => {
  const csrf = useCsrfToken();
  const [metrics, setMetrics] = useState<{ users: number; products: number; sales: number; revenue: number } | null>(null);
  const load = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";
      const resp = await fetch("/api/admin/analytics", { headers: { "x-csrf-token": csrf, "Authorization": token ? `Bearer ${token}` : "" } });
      const data = await resp.json();
      setMetrics(data);
    } catch { toast.error("Falha ao carregar métricas"); }
  };
  useEffect(() => { if (csrf) load(); }, [csrf]);
  const exportCsv = () => {
    if (!metrics) return;
    const rows = ["users,products,sales,revenue", `${metrics.users},${metrics.products},${metrics.sales},${metrics.revenue}`];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "analytics.csv"; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Card className="border-primary/20">
      <CardHeader><CardTitle>Análises</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!metrics ? (<div className="h-16 flex items-center justify-center text-muted-foreground">Sem dados</div>) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="text-sm text-muted-foreground">Usuários</div><div className="text-2xl font-bold">{metrics.users}</div></div>
            <div><div className="text-sm text-muted-foreground">Produtos</div><div className="text-2xl font-bold">{metrics.products}</div></div>
            <div><div className="text-sm text-muted-foreground">Vendas</div><div className="text-2xl font-bold">{metrics.sales}</div></div>
            <div><div className="text-sm text-muted-foreground">Receita</div><div className="text-2xl font-bold">R$ {metrics.revenue.toFixed(2)}</div></div>
          </div>
        )}
        <Button variant="outline" onClick={exportCsv}>Exportar CSV</Button>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<UsersPage />} />
        </Routes>
      </AdminLayout>
    </RequireAdmin>
  );
};

export default Admin;
