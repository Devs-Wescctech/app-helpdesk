import { MetricCard } from "../MetricCard";
import { Ticket } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2">
      <MetricCard
        title="Total de Chamados"
        value={168}
        trend={{ value: 12, isPositive: true }}
        icon={Ticket}
      />
      <MetricCard
        title="Taxa de Resolução"
        value="94%"
        trend={{ value: 3, isPositive: false }}
        icon={Ticket}
      />
    </div>
  );
}
