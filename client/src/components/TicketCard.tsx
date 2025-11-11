import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge, TicketStatus } from "./StatusBadge";
import { PriorityBadge, Priority } from "./PriorityBadge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: Priority;
  assignee?: {
    name: string;
    avatar?: string;
  };
  slaRemaining?: string;
  slaStatus?: "ok" | "warning" | "breach";
  createdAt: string;
  onClick?: () => void;
  className?: string;
}

export function TicketCard({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  slaRemaining,
  slaStatus = "ok",
  createdAt,
  onClick,
  className,
}: TicketCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer hover-elevate active-elevate-2 transition-shadow",
        className
      )}
      onClick={onClick}
      data-testid={`card-ticket-${id}`}
    >
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground" data-testid={`text-ticket-id-${id}`}>
            #{id}
          </span>
          <PriorityBadge priority={priority} showIcon={false} />
        </div>
        <h3 className="font-medium leading-tight line-clamp-2" data-testid={`text-ticket-title-${id}`}>
          {title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={status} />
          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} />
              <AvatarFallback className="text-xs">
                {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {slaRemaining && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              slaStatus === "warning" && "text-yellow-600",
              slaStatus === "breach" && "text-red-600",
              slaStatus === "ok" && "text-muted-foreground"
            )}
          >
            <Clock className="h-3 w-3" />
            <span>SLA: {slaRemaining}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {createdAt}
        </div>
      </CardContent>
    </Card>
  );
}
