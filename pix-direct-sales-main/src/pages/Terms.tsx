import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Info, Handshake, Wallet, ShieldCheck, UserCheck, UserPlus, ClipboardList, Undo2, ShieldAlert, Ban, Users, ShoppingCart, LifeBuoy, ThumbsUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>Voltar</Button>
        </div>
        <Card className="border-primary/20 shadow-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6 text-[#8A2BE2]" /> TERMOS DE USO GERAIS DA PLATAFORMA GOUPAY</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground space-y-6">
            <p>Última atualização: [dd/mm/aaaa]</p>
            <p>
              A GouPay é uma plataforma digital de intermediação tecnológica que conecta Vendedores independentes a Compradores, oferecendo ferramentas de criação de páginas de vendas, área de membros e processamento técnico de pagamentos com repasse direto dos valores aos Vendedores.
            </p>
            <p>
              A GouPay não é vendedora, fornecedora, comerciante ou proprietária dos produtos e serviços anunciados, atuando exclusivamente como provedora da tecnologia de intermediação.
            </p>
            <div className="flex items-center gap-2"><Info className="h-5 w-5 text-[#8A2BE2]" /> <h2>I — TERMOS GERAIS</h2></div>
            <div className="flex items-center gap-2"><Handshake className="h-5 w-5 text-[#8A2BE2]" /> <h3>1. Da Intermediação</h3></div>
            <p>
              A GouPay atua exclusivamente como intermediadora tecnológica, não sendo parte integrante das relações comerciais firmadas entre Compradores e Vendedores.
            </p>
            <div className="flex items-center gap-2"><Wallet className="h-5 w-5 text-[#8A2BE2]" /> <h3>2. Do Fluxo Financeiro</h3></div>
            <p>Todos os pagamentos:</p>
            <ul>
              <li>São destinados diretamente à conta bancária do Vendedor cadastrado;</li>
              <li>A GouPay não recebe, não retém, não custodia e não administra valores pagos pelos Compradores;</li>
              <li>A GouPay não realiza repasses, splits, bloqueios ou retenções financeiras.</li>
            </ul>
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#8A2BE2]" /> <h3>3. Da Responsabilidade</h3></div>
            <p>As obrigações comerciais, fiscais e consumeristas decorrentes da venda são de responsabilidade exclusiva do Vendedor, incluindo:</p>
            <ul>
              <li>Garantias;</li>
              <li>Atendimento ao consumidor;</li>
              <li>Cumprimento do Código de Defesa do Consumidor;</li>
              <li>Entrega dos produtos;</li>
              <li>Emissão de notas fiscais;</li>
              <li>Cancelamentos e reembolsos.</li>
            </ul>
            <Separator className="my-6" />
            <div className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-[#8A2BE2]" /> <h2>II — TERMOS DO VENDEDOR</h2></div>
            <div className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#8A2BE2]" /> <h3>4. Cadastro</h3></div>
            <p>Ao se cadastrar como Vendedor na GouPay, declara:</p>
            <ul>
              <li>Possuir capacidade legal;</li>
              <li>Fornecer dados verdadeiros;</li>
              <li>Estar apto a comercializar produtos/serviços conforme legislação vigente.</li>
            </ul>
            <div className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-[#8A2BE2]" /> <h3>5. Obrigações do Vendedor</h3></div>
            <p>O Vendedor é o responsável exclusivo por:</p>
            <ul>
              <li>Criação do conteúdo e ofertas;</li>
              <li>Entrega dos produtos/serviços;</li>
              <li>Atendimento aos clientes;</li>
              <li>Cumprimento das regras do CDC;</li>
              <li>Emissão de documento fiscal;</li>
              <li>Reembolsos, cancelamentos e chargebacks;</li>
              <li>Garantia legal e pós-venda.</li>
            </ul>
            <div className="flex items-center gap-2"><Undo2 className="h-5 w-5 text-[#8A2BE2]" /> <h3>6. Reembolsos</h3></div>
            <p>Todas as solicitações de:</p>
            <ul>
              <li>Cancelamento;</li>
              <li>Arrependimento;</li>
              <li>Troca;</li>
              <li>Reembolso;</li>
            </ul>
            <p>devem ser cumpridas pelo próprio Vendedor, que recebe diretamente os valores.</p>
            <p>A GouPay:</p>
            <ul>
              <li>Não realiza estornos;</li>
              <li>Não opera valores financeiros;</li>
              <li>Não assume ônus financeiro.</li>
            </ul>
            <div className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-[#8A2BE2]" /> <h3>7. Isenção e Ressarcimento</h3></div>
            <p>O Vendedor isenta e compromete-se a ressarcir a GouPay por toda e qualquer despesa decorrente de:</p>
            <ul>
              <li>Demandas judiciais ou administrativas de consumidores;</li>
              <li>Multas, condenações ou indenizações;</li>
              <li>Descumprimento do CDC ou obrigações legais.</li>
            </ul>
            <div className="flex items-center gap-2"><Ban className="h-5 w-5 text-[#8A2BE2]" /> <h3>8. Sanções</h3></div>
            <p>A GouPay poderá:</p>
            <ul>
              <li>Suspender contas;</li>
              <li>Bloquear páginas de venda;</li>
              <li>Cancelar acesso definitivo;</li>
            </ul>
            <p>em caso de denúncias, práticas abusivas ou descumprimento destes Termos.</p>
            <Separator className="my-6" />
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-[#8A2BE2]" /> <h2>III — TERMOS DO COMPRADOR</h2></div>
            <div className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-[#8A2BE2]" /> <h3>9. Natureza da Compra</h3></div>
            <p>O Comprador reconhece que:</p>
            <ul>
              <li>Compra diretamente do Vendedor;</li>
              <li>A GouPay é apenas intermediadora tecnológica;</li>
              <li>A plataforma não é responsável por produtos ou serviços adquiridos.</li>
            </ul>
            <div className="flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-[#8A2BE2]" /> <h3>10. Suporte e Atendimento</h3></div>
            <p>Todo suporte deverá ser solicitado ao próprio Vendedor.</p>
            <div className="flex items-center gap-2"><Undo2 className="h-5 w-5 text-[#8A2BE2]" /> <h3>11. Reembolsos</h3></div>
            <p>Pedidos de:</p>
            <ul>
              <li>Cancelamento;</li>
              <li>Devolução;</li>
              <li>Reembolso;</li>
            </ul>
            <p>devem ser encaminhados diretamente ao Vendedor. A GouPay não possui autonomia nem disponibilidade financeira para efetuar estornos.</p>
            <div className="flex items-center gap-2"><Handshake className="h-5 w-5 text-[#8A2BE2]" /> <h3>12. Mediação</h3></div>
            <p>A GouPay poderá atuar facultativamente como mediadora, sem assumir responsabilidade financeira.</p>
            <div className="flex items-center gap-2"><ThumbsUp className="h-5 w-5 text-[#8A2BE2]" /> <h3>13. Dever de Boa-fé</h3></div>
            <p>O Comprador compromete-se a:</p>
            <ul>
              <li>Fornecer dados verdadeiros;</li>
              <li>Não praticar fraude;</li>
              <li>Não realizar chargebacks indevidos.</li>
            </ul>
            <div className="flex items-center gap-2"><Ban className="h-5 w-5 text-[#8A2BE2]" /> <h3>14. Sanções</h3></div>
            <p>Em caso de fraude ou abuso:</p>
            <ul>
              <li>A conta poderá ser suspensa;</li>
              <li>O acesso poderá ser bloqueado.</li>
            </ul>
            <Separator className="my-6" />
            <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-[#8A2BE2]" /> <h2>IV — LIMITAÇÃO DE RESPONSABILIDADE</h2></div>
            <p>A GouPay não responderá por:</p>
            <ul>
              <li>Atrasos ou falhas na entrega;</li>
              <li>Vícios do produto;</li>
              <li>Garantias;</li>
              <li>Reembolsos;</li>
              <li>Danos morais ou materiais oriundos da relação entre Comprador e Vendedor.</li>
            </ul>
            <p>Sua responsabilidade se limita exclusivamente ao funcionamento técnico da plataforma.</p>
            <Separator className="my-6" />
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-[#8A2BE2]" /> <h2>V — ACEITAÇÃO DOS TERMOS</h2></div>
            <p>O uso da plataforma pressupõe:</p>
            <ul>
              <li>Aceitação integral destes Termos;</li>
              <li>Concordância expressa com a divisão de responsabilidades aqui estabelecida.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Terms;
