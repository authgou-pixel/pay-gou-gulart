import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            <CardTitle>TERMOS DE USO GERAIS DA PLATAFORMA GOUPAY</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground">
            <p>Última atualização: [dd/mm/aaaa]</p>
            <p>
              A GouPay é uma plataforma digital de intermediação tecnológica que conecta Vendedores independentes a Compradores, oferecendo ferramentas de criação de páginas de vendas, área de membros e processamento técnico de pagamentos com repasse direto dos valores aos Vendedores.
            </p>
            <p>
              A GouPay não é vendedora, fornecedora, comerciante ou proprietária dos produtos e serviços anunciados, atuando exclusivamente como provedora da tecnologia de intermediação.
            </p>
            <h2>I — TERMOS GERAIS</h2>
            <h3>1. Da Intermediação</h3>
            <p>
              A GouPay atua exclusivamente como intermediadora tecnológica, não sendo parte integrante das relações comerciais firmadas entre Compradores e Vendedores.
            </p>
            <h3>2. Do Fluxo Financeiro</h3>
            <p>Todos os pagamentos:</p>
            <ul>
              <li>São destinados diretamente à conta bancária do Vendedor cadastrado;</li>
              <li>A GouPay não recebe, não retém, não custodia e não administra valores pagos pelos Compradores;</li>
              <li>A GouPay não realiza repasses, splits, bloqueios ou retenções financeiras.</li>
            </ul>
            <h3>3. Da Responsabilidade</h3>
            <p>As obrigações comerciais, fiscais e consumeristas decorrentes da venda são de responsabilidade exclusiva do Vendedor, incluindo:</p>
            <ul>
              <li>Garantias;</li>
              <li>Atendimento ao consumidor;</li>
              <li>Cumprimento do Código de Defesa do Consumidor;</li>
              <li>Entrega dos produtos;</li>
              <li>Emissão de notas fiscais;</li>
              <li>Cancelamentos e reembolsos.</li>
            </ul>
            <h2>II — TERMOS DO VENDEDOR</h2>
            <h3>4. Cadastro</h3>
            <p>Ao se cadastrar como Vendedor na GouPay, declara:</p>
            <ul>
              <li>Possuir capacidade legal;</li>
              <li>Fornecer dados verdadeiros;</li>
              <li>Estar apto a comercializar produtos/serviços conforme legislação vigente.</li>
            </ul>
            <h3>5. Obrigações do Vendedor</h3>
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
            <h3>6. Reembolsos</h3>
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
            <h3>7. Isenção e Ressarcimento</h3>
            <p>O Vendedor isenta e compromete-se a ressarcir a GouPay por toda e qualquer despesa decorrente de:</p>
            <ul>
              <li>Demandas judiciais ou administrativas de consumidores;</li>
              <li>Multas, condenações ou indenizações;</li>
              <li>Descumprimento do CDC ou obrigações legais.</li>
            </ul>
            <h3>8. Sanções</h3>
            <p>A GouPay poderá:</p>
            <ul>
              <li>Suspender contas;</li>
              <li>Bloquear páginas de venda;</li>
              <li>Cancelar acesso definitivo;</li>
            </ul>
            <p>em caso de denúncias, práticas abusivas ou descumprimento destes Termos.</p>
            <h2>III — TERMOS DO COMPRADOR</h2>
            <h3>9. Natureza da Compra</h3>
            <p>O Comprador reconhece que:</p>
            <ul>
              <li>Compra diretamente do Vendedor;</li>
              <li>A GouPay é apenas intermediadora tecnológica;</li>
              <li>A plataforma não é responsável por produtos ou serviços adquiridos.</li>
            </ul>
            <h3>10. Suporte e Atendimento</h3>
            <p>Todo suporte deverá ser solicitado ao próprio Vendedor.</p>
            <h3>11. Reembolsos</h3>
            <p>Pedidos de:</p>
            <ul>
              <li>Cancelamento;</li>
              <li>Devolução;</li>
              <li>Reembolso;</li>
            </ul>
            <p>devem ser encaminhados diretamente ao Vendedor. A GouPay não possui autonomia nem disponibilidade financeira para efetuar estornos.</p>
            <h3>12. Mediação</h3>
            <p>A GouPay poderá atuar facultativamente como mediadora, sem assumir responsabilidade financeira.</p>
            <h3>13. Dever de Boa-fé</h3>
            <p>O Comprador compromete-se a:</p>
            <ul>
              <li>Fornecer dados verdadeiros;</li>
              <li>Não praticar fraude;</li>
              <li>Não realizar chargebacks indevidos.</li>
            </ul>
            <h3>14. Sanções</h3>
            <p>Em caso de fraude ou abuso:</p>
            <ul>
              <li>A conta poderá ser suspensa;</li>
              <li>O acesso poderá ser bloqueado.</li>
            </ul>
            <h2>IV — LIMITAÇÃO DE RESPONSABILIDADE</h2>
            <p>A GouPay não responderá por:</p>
            <ul>
              <li>Atrasos ou falhas na entrega;</li>
              <li>Vícios do produto;</li>
              <li>Garantias;</li>
              <li>Reembolsos;</li>
              <li>Danos morais ou materiais oriundos da relação entre Comprador e Vendedor.</li>
            </ul>
            <p>Sua responsabilidade se limita exclusivamente ao funcionamento técnico da plataforma.</p>
            <h2>V — ACEITAÇÃO DOS TERMOS</h2>
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

