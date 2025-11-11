import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCard } from "@/components/TicketCard";
import { StatusBadge, TicketStatus } from "@/components/StatusBadge";
import { PriorityBadge, Priority } from "@/components/PriorityBadge";
import { Plus, Search, LayoutGrid, List as ListIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockTickets = [
  {
    id: "2024-001",
    title: "Impressora não está funcionando",
    description: "A impressora do 3º andar parou de responder",
    status: "open" as TicketStatus,
    priority: "high" as Priority,
    assignee: { name: "João Silva" },
    slaRemaining: "3h 20m",
    slaStatus: "ok" as const,
    createdAt: "Há 2 horas",
  },
  {
    id: "2024-002",
    title: "Sistema de e-mail fora do ar",
    description: "Não consigo acessar meu e-mail corporativo",
    status: "in_progress" as TicketStatus,
    priority: "critical" as Priority,
    assignee: { name: "Maria Santos" },
    slaRemaining: "45m",
    slaStatus: "warning" as const,
    createdAt: "Há 1 hora",
  },
  {
    id: "2024-003",
    title: "Solicitação de novo software",
    description: "Preciso do Adobe Photoshop instalado",
    status: "waiting" as TicketStatus,
    priority: "low" as Priority,
    assignee: { name: "Pedro Costa" },
    slaRemaining: "20h 15m",
    slaStatus: "ok" as const,
    createdAt: "Ontem",
  },
  {
    id: "2024-004",
    title: "Computador lento",
    description: "O computador está muito lento e travando",
    status: "in_progress" as TicketStatus,
    priority: "medium" as Priority,
    assignee: { name: "Ana Oliveira" },
    slaRemaining: "5h 30m",
    slaStatus: "ok" as const,
    createdAt: "Há 3 horas",
  },
  {
    id: "2024-005",
    title: "Senha expirada",
    description: "Minha senha expirou e não consigo resetar",
    status: "resolved" as TicketStatus,
    priority: "medium" as Priority,
    assignee: { name: "João Silva" },
    slaRemaining: "-",
    slaStatus: "ok" as const,
    createdAt: "Há 5 horas",
  },
];

export default function Tickets() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { status: "open" as TicketStatus, title: "Aberto" },
    { status: "in_progress" as TicketStatus, title: "Em Atendimento" },
    { status: "waiting" as TicketStatus, title: "Aguardando" },
    { status: "resolved" as TicketStatus, title: "Resolvido" },
    { status: "closed" as TicketStatus, title: "Fechado" },
  ];

  const getTicketsByStatus = (status: TicketStatus) => {
    return mockTickets.filter((ticket) => ticket.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Chamados</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os chamados de suporte
          </p>
        </div>
        <Button data-testid="button-new-ticket">
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar chamados..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-tickets"
          />
        </div>
        <div className="flex gap-1 rounded-md border p-1">
          <Button
            variant={view === "kanban" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("kanban")}
            data-testid="button-view-kanban"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            data-testid="button-view-list"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.status} className="min-w-80 flex-1">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {getTicketsByStatus(column.status).length}
                </span>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3 pr-4">
                  {getTicketsByStatus(column.status).map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      {...ticket}
                      onClick={() => console.log("Ticket clicked:", ticket.id)}
                    />
                  ))}
                  {getTicketsByStatus(column.status).length === 0 && (
                    <div className="rounded-md border border-dashed p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhum chamado
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Criado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => console.log("Ticket clicked:", ticket.id)}
                  data-testid={`row-ticket-${ticket.id}`}
                >
                  <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {ticket.assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{ticket.slaRemaining}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {ticket.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
