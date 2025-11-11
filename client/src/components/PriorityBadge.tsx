import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUp, Minus, ArrowDown } from "lucide-react";

export type Priority = "critical" | "high" | "medium" | "low";

const priorityConfig: Record<Priority, { label: string; className: string; icon: any }> = {
  critical: {
    label: "Crítico",
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
    icon: AlertCircle,
  },
  high: {
    label: "Alto",
    className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30",
    icon: ArrowUp,
  },
  medium: {
    label: "Médio",
    className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
    icon: Minus,
  },
  low: {
    label: "Baixo",
    className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30",
    icon: ArrowDown,
  },
};

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(config.className, "gap-1", className)}
      data-testid={`badge-priority-${priority}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
