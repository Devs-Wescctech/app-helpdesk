import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SLAIndicatorProps {
  timeRemaining: string;
  percentage: number;
  status: "ok" | "warning" | "breach";
}

export function SLAIndicator({ timeRemaining, percentage, status }: SLAIndicatorProps) {
  const getColor = () => {
    if (status === "breach") return "bg-red-500";
    if (status === "warning") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTextColor = () => {
    if (status === "breach") return "text-red-600";
    if (status === "warning") return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", getTextColor())}>
          {timeRemaining}
        </span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-1.5 bg-muted" />
        <div
          className={cn("absolute inset-0 h-1.5 rounded-full transition-all", getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
