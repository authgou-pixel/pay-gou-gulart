import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Banknote, ArrowRightLeft, Library, Download, QrCode, Shield, User, Palette, CheckCircle, PlayCircle, Users, Ban, RefreshCcw } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <header className="w-full sticky top-0 z-40 border-b border-[#8A2BE2]/30 bg-[#1A1A1A]/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#232323] border border-[#8A2BE2]/30 text-[#CFCFCF]">
              <Shield className="h-4 w-4 text-[#8A2BE2]" />
              <span>GouPay</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#8A2BE2]/40 text-white hover:bg-[#8A2BE2]/10" onClick={() => navigate("/auth")}> 
              <User className="h-4 w-4 mr-2" /> Entrar
            </Button>
            <Button className="bg-gradient-to-r from-[#8A2BE2] to-[#D34FE2] text-black font-semibold hover:opacity-90" onClick={() => navigate("/auth?signup=1")}> 
              Criar conta
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-24">
          <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#8A2BE2]/20 blur-[100px]"></div>
          <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#5E2DBE]/20 blur-[100px]"></div>
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-[#C6A3FF] bg-clip-text text-transparent">Plataforma completa para venda de produtos digitais</h1>
            <p className="text-lg md:text-xl text-[#CFCFCF] mb-10 max-w-3xl mx-auto">Alta conversão, recuperação de vendas e operação sem bloqueios. Aprovação automática, saque rápido e integração direta.</p>
            <div className="mt-10 flex justify-center">
              <img src="https://i.imgur.com/vtcLGj6.png" alt="Visão geral da plataforma" className="w-full max-w-4xl h-auto rounded-xl border border-[#8A2BE2]/30 shadow-lg" loading="lazy" referrerPolicy="no-referrer" />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Diferenciais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#232323] border-[#8A2BE2]/20 hover:border-[#8A2BE2]/40 transition transform hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#8A2BE2]/20 flex items-center justify-center mb-3"><Palette className="h-6 w-6 text-[#8A2BE2]" /></div>
                  <CardTitle>Checkout customizável</CardTitle>
                  <CardDescription>Estilos, cores e elementos ajustáveis para sua oferta.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#232323] border-[#8A2BE2]/20 hover:border-[#8A2BE2]/40 transition transform hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#8A2BE2]/20 flex items-center justify-center mb-3"><CheckCircle className="h-6 w-6 text-[#8A2BE2]" /></div>
                  <CardTitle>Aprovação instantânea</CardTitle>
                  <CardDescription>Produtos liberados sem fricção e sem bloqueios.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#232323] border-[#8A2BE2]/20 hover:border-[#8A2BE2]/40 transition transform hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#8A2BE2]/20 flex items-center justify-center mb-3"><PlayCircle className="h-6 w-6 text-[#8A2BE2]" /></div>
                  <CardTitle>Área de membros premium</CardTitle>
                  <CardDescription>Experiência estilo streaming para seus conteúdos.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#232323] border-[#8A2BE2]/20 hover:border-[#8A2BE2]/40 transition transform hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#8A2BE2]/20 flex items-center justify-center mb-3"><Users className="h-6 w-6 text-[#8A2BE2]" /></div>
                  <CardTitle>Afiliação e coprodução</CardTitle>
                  <CardDescription>Parcerias e marketplace para escalar vendas.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#232323] border-[#8A2BE2]/20 hover:border-[#8A2BE2]/40 transition transform hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#8A2BE2]/20 flex items-center justify-center mb-3"><Ban className="h-6 w-6 text-[#8A2BE2]" /></div>
                  <CardTitle>Sem bloqueios</CardTitle>
                  <CardDescription>Operação transparente e segura para qualquer produto.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#232323] border-[#8A2BE2]/20 hover:border-[#8A2BE2]/40 transition transform hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#8A2BE2]/20 flex items-center justify-center mb-3"><RefreshCcw className="h-6 w-6 text-[#8A2BE2]" /></div>
                  <CardTitle>Recuperação de vendas</CardTitle>
                  <CardDescription>Estratégias para retomar carrinhos abandonados.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Área de Membros</h2>
                <div className="space-y-3 text-[#CFCFCF]">
                  <div className="flex items-center gap-2"><Library className="h-5 w-5 text-[#8A2BE2]" /> Acesso a produtos adquiridos</div>
                  <div className="flex items-center gap-2"><QrCode className="h-5 w-5 text-[#8A2BE2]" /> Biblioteca de conteúdos digitais</div>
                  <div className="flex items-center gap-2"><Download className="h-5 w-5 text-[#8A2BE2]" /> Gerenciamento de downloads</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button className="bg-gradient-to-r from-[#8A2BE2] to-[#D34FE2] text-black font-semibold hover:opacity-90" onClick={() => navigate("/auth?signup=1")}>Criar conta</Button>
                  <Button variant="outline" className="border-[#8A2BE2]/40 text-white hover:bg-[#8A2BE2]/10" onClick={() => navigate("/auth")}>Entrar</Button>
                </div>
              </div>
              <div>
                <img src="https://i.imgur.com/a6O13Qu.png" alt="Área de Membros" className="rounded-xl shadow-lg border border-[#8A2BE2]/30" />
              </div>
            </div>
          </div>
        </section>

        
      </main>

      <footer className="border-t border-[#8A2BE2]/30 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-[#9A9A9A]">
          <p>© 2024 PIX Direct Sales. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
