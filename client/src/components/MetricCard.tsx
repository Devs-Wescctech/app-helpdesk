import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({ title, value, trend, icon: Icon, className }: MetricCardProps) {
  return (
    <Card className={className} data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {trend.isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-600" />
            )}
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">vs. mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
