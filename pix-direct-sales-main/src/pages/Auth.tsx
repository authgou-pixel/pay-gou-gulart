import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const signup = params.get("signup");
    const prefillEmail = params.get("prefillEmail");
    if (signup === "1") setIsLogin(false);
    if (prefillEmail) setEmail(prefillEmail);
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate, location.search]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
        if (data.session) {
          toast.success("Cadastro concluído! Entrando...");
          navigate("/dashboard");
        } else {
          toast.info("Verifique seu e-mail para confirmar o cadastro. Após confirmar, você será direcionado ao dashboard.");
          // tentativa de login automático caso confirmação por e-mail esteja desativada
          try {
            const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
            if (!loginErr) {
              navigate("/dashboard");
              return;
            }BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;BEGIN;

-- Garantir RLS ON
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercado_pago_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Remover políticas amplas que permitem ações para 'authenticated' sem ownership
DROP POLICY IF EXISTS modules_owner_manage_all ON public.modules;
DROP POLICY IF EXISTS modules_insert_admin ON public.modules;
DROP POLICY IF EXISTS modules_update_admin ON public.modules;
DROP POLICY IF EXISTS modules_delete_admin ON public.modules;

DROP POLICY IF EXISTS products_insert_admin ON public.products;
DROP POLICY IF EXISTS products_update_admin ON public.products;
DROP POLICY IF EXISTS products_delete_admin ON public.products;

DROP POLICY IF EXISTS subscriptions_select_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_owner ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_delete_admin ON public.subscriptions;

-- Leitura pública só de produtos ativos
CREATE POLICY public_select_active_products
ON public.products FOR SELECT TO public
USING (is_active = true);

-- Dono vê e gerencia próprios produtos
CREATE POLICY owner_select_products
ON public.products FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY owner_insert_products
ON public.products FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_update_products
ON public.products FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY owner_delete_products
ON public.products FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Sales: apenas SELECT para o vendedor; escritas via service role
CREATE POLICY seller_select_sales
ON public.sales FOR SELECT TO authenticated
USING (seller_id = auth.uid());

-- Memberships: comprador enxerga e pode vincular perfil próprio
CREATE POLICY memberships_select_buyer
ON public.memberships FOR SELECT TO authenticated
USING (buyer_user_id = auth.uid() OR buyer_email = (auth.jwt() ->> 'email'));

CREATE POLICY memberships_update_link_profile
ON public.memberships FOR UPDATE TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'))
WITH CHECK (buyer_user_id = auth.uid());

-- Subscriptions: dono vê própria assinatura; UPDATE/INSERT só via service role
CREATE POLICY owner_select_subscriptions
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Mercado Pago config: somente dono pode CRUD
CREATE POLICY owner_manage_mp_config
ON public.mercado_pago_config FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Profiles: dono vê/atualiza o próprio
CREATE POLICY owner_select_profile
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY owner_update_profile
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

COMMIT;
          } catch { void 0 }
          setIsLogin(true);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao processar requisição";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <Card className="w-full max-w-md shadow-purple border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-hero bg-clip-text text-transparent">
            {isLogin ? "Entrar" : "Criar Conta"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? "Entre com suas credenciais para acessar sua plataforma"
              : "Crie sua conta e comece a vender"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-primary/20"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-primary/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-hero hover:opacity-90 shadow-purple"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                isLogin ? "Entrar" : "Criar Conta"
              )}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin 
                  ? "Não tem conta? Cadastre-se" 
                  : "Já tem conta? Faça login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
