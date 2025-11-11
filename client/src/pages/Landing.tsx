import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, BarChart3, FolderKanban, Users, Clock, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
              <Ticket className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">Helpdesk</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Sistema Completo de Suporte TI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gerencie chamados, projetos e equipes com eficiência. 
              Dashboard analítico, SLAs automáticos e gestão Kanban integrada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild data-testid="button-login">
              <a href="/api/login">
                Fazer Login
              </a>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-16">
            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mx-auto">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Dashboard Analítico</h3>
                <p className="text-sm text-muted-foreground">
                  Métricas em tempo real: TMA, TME, SLA e nível de serviço
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mx-auto">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Gestão Kanban</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize chamados e projetos em quadros Kanban intuitivos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 mx-auto">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">SLAs Automáticos</h3>
                <p className="text-sm text-muted-foreground">
                  Templates configuráveis com alertas e monitoramento contínuo
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-16 grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">96%</div>
              <div className="text-sm text-muted-foreground">Nível de Serviço</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2.4h</div>
              <div className="text-sm text-muted-foreground">Tempo Médio Atendimento</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Taxa de Resolução</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
