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

type UserRole = "admin" | "technician" | "user";

const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "(11) 98765-4321",
    role: "admin" as UserRole,
    department: "TI",
    activeTickets: 12,
    resolvedTickets: 145,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    phone: "(11) 98765-4322",
    role: "technician" as UserRole,
    department: "TI",
    activeTickets: 8,
    resolvedTickets: 132,
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@empresa.com",
    phone: "(11) 98765-4323",
    role: "technician" as UserRole,
    department: "TI",
    activeTickets: 10,
    resolvedTickets: 98,
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@empresa.com",
    phone: "(11) 98765-4324",
    role: "user" as UserRole,
    department: "Financeiro",
    activeTickets: 2,
    resolvedTickets: 15,
  },
  {
    id: "5",
    name: "Carlos Lima",
    email: "carlos.lima@empresa.com",
    phone: "(11) 98765-4325",
    role: "user" as UserRole,
    department: "RH",
    activeTickets: 1,
    resolvedTickets: 8,
  },
];

const roleConfig = {
  admin: { label: "Administrador", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  technician: { label: "Técnico", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  user: { label: "Usuário", color: "bg-gray-500/10 text-gray-700 dark:text-gray-400" },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

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
        {mockUsers.map((user) => (
          <Card
            key={user.id}
            className="hover-elevate transition-shadow"
            data-testid={`card-user-${user.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium leading-tight">{user.name}</h3>
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-md bg-muted/50 p-3">
                <div className="text-center">
                  <p className="text-xl font-bold">{user.activeTickets}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-xl font-bold">{user.resolvedTickets}</p>
                  <p className="text-xs text-muted-foreground">Resolvidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
