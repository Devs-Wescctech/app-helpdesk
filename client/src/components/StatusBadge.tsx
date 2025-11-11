import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: {
    label: "Aberto",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  in_progress: {
    label: "Em Atendimento",
    className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  waiting: {
    label: "Aguardando",
    className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  },
  resolved: {
    label: "Resolvido",
    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  closed: {
    label: "Fechado",
    className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  },
};

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}
