import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle2, Users, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const ticketsByTechnician = [
    { name: "João Silva", tickets: 45 },
    { name: "Maria Santos", tickets: 38 },
    { name: "Pedro Costa", tickets: 32 },
    { name: "Ana Oliveira", tickets: 28 },
    { name: "Carlos Lima", tickets: 25 },
  ];

  const ticketsTrend = [
    { month: "Jan", tickets: 120 },
    { month: "Fev", tickets: 145 },
    { month: "Mar", tickets: 132 },
    { month: "Abr", tickets: 158 },
    { month: "Mai", tickets: 142 },
    { month: "Jun", tickets: 168 },
  ];

  const priorityData = [
    { name: "Crítico", value: 12, color: "#ef4444" },
    { name: "Alto", value: 28, color: "#f97316" },
    { name: "Médio", value: 45, color: "#eab308" },
    { name: "Baixo", value: 83, color: "#9ca3af" },
  ];

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
          value={168}
          trend={{ value: 12, isPositive: true }}
          icon={Ticket}
        />
        <MetricCard
          title="TMA (Tempo Médio)"
          value="2.4h"
          trend={{ value: 8, isPositive: false }}
          icon={Clock}
        />
        <MetricCard
          title="Taxa de Resolução"
          value="94%"
          trend={{ value: 3, isPositive: true }}
          icon={CheckCircle2}
        />
        <MetricCard
          title="Nível de Serviço"
          value="96%"
          trend={{ value: 2, isPositive: true }}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chamados por Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketsByTechnician}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendência de Chamados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketsTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">SLA por Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Crítico (2h)</p>
                  <p className="text-xs text-muted-foreground">12 chamados ativos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">98%</p>
                  <p className="text-xs text-muted-foreground">no prazo</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Alto (4h)</p>
                  <p className="text-xs text-muted-foreground">28 chamados ativos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">96%</p>
                  <p className="text-xs text-muted-foreground">no prazo</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Médio (8h)</p>
                  <p className="text-xs text-muted-foreground">45 chamados ativos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">92%</p>
                  <p className="text-xs text-muted-foreground">no prazo</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Baixo (24h)</p>
                  <p className="text-xs text-muted-foreground">83 chamados ativos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">99%</p>
                  <p className="text-xs text-muted-foreground">no prazo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
