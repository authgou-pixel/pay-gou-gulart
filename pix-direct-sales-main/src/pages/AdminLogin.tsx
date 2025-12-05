import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const expectedEmail = (import.meta.env.VITE_ADMIN_LOCAL_EMAIL || "authgou@gmail.com").toLowerCase();
  const expectedPassword = import.meta.env.VITE_ADMIN_LOCAL_PASSWORD || "Luna2007#";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    const pw = password.trim();
    if (em === expectedEmail && (expectedPassword ? pw === expectedPassword : true)) {
      localStorage.setItem("admin_local_auth", JSON.stringify({ email: expectedEmail }));
      toast.success("Acesso liberado");
      navigate("/admin");
    } else {
      toast.error("Credenciais inválidas");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <Card className="w-[90%] sm:w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Login Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/")}>Voltar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
