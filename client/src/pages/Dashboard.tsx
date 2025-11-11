import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  slaBreach: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  resolutionRate: number;
  serviceLevel: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do sistema de suporte
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do sistema de suporte
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Chamados"
          value={stats?.totalTickets || 0}
          icon={Ticket}
        />
        <MetricCard
          title="TMA (Tempo Médio)"
          value={`${stats?.avgResponseTime || 0}h`}
          icon={Clock}
        />
        <MetricCard
          title="Taxa de Resolução"
          value={`${stats?.resolutionRate || 0}%`}
          icon={CheckCircle2}
        />
        <MetricCard
          title="Nível de Serviço"
          value={`${stats?.serviceLevel || 0}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chamados por Técnico</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendência de Chamados</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">SLA por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
