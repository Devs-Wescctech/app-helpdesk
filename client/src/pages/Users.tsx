import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, Ticket } from "@shared/schema";

type UserRole = "admin" | "technician" | "user";

const roleConfig = {
  admin: { label: "Administrador", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  technician: { label: "Técnico", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  user: { label: "Usuário", color: "bg-gray-500/10 text-gray-700 dark:text-gray-400" },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: tickets = [] } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
  });

  const getUserTicketStats = (userId: string) => {
    const userTickets = tickets.filter(
      (t) => t.assigneeId === userId || t.requesterId === userId
    );
    const activeTickets = userTickets.filter(
      (t) => t.status !== "resolved" && t.status !== "closed"
    ).length;
    const resolvedTickets = userTickets.filter(
      (t) => t.status === "resolved" || t.status === "closed"
    ).length;
    return { activeTickets, resolvedTickets };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        <Button data-testid="button-new-user">
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-users"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const stats = getUserTicketStats(user.id);
          return (
            <Card
              key={user.id}
              className="hover-elevate transition-shadow"
              data-testid={`card-user-${user.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImageUrl || ""} />
                      <AvatarFallback>
                        {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium leading-tight">
                        {`${user.firstName} ${user.lastName}`}
                      </h3>
                      <Badge variant="outline" className={roleConfig[user.role].color}>
                        {roleConfig[user.role].label}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${user.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver Chamados</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Desativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  {user.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="text-sm text-muted-foreground">
                      Departamento: {user.department}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-md bg-muted/50 p-3">
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.activeTickets}</p>
                    <p className="text-xs text-muted-foreground">Ativos</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.resolvedTickets}</p>
                    <p className="text-xs text-muted-foreground">Resolvidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
