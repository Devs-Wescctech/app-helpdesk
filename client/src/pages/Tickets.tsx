import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Ticket, User } from "@shared/schema";
import { insertTicketSchema } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

const ticketFormSchema = insertTicketSchema.extend({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["critical", "high", "medium", "low"]),
}).omit({
  requesterId: true,
  assigneeId: true,
  slaTemplateId: true,
  slaDeadline: true,
  slaBreach: true,
  status: true,
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export default function Tickets() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketFormValues) => {
      const res = await apiRequest("POST", "/api/tickets", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Chamado criado",
        description: "O chamado foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar chamado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TicketFormValues) => {
    createTicketMutation.mutate(data);
  };

  const columns = [
    { status: "open" as TicketStatus, title: "Aberto" },
    { status: "in_progress" as TicketStatus, title: "Em Atendimento" },
    { status: "waiting" as TicketStatus, title: "Aguardando" },
    { status: "resolved" as TicketStatus, title: "Resolvido" },
    { status: "closed" as TicketStatus, title: "Fechado" },
  ];

  const getTicketsByStatus = (status: TicketStatus) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  const getUserById = (userId: string | null) => {
    return users.find((u) => u.id === userId);
  };

  const formatSLARemaining = (deadline: string | null) => {
    if (!deadline) return "-";
    const now = new Date();
    const slaDate = new Date(deadline);
    const diff = slaDate.getTime() - now.getTime();
    
    if (diff < 0) return "Vencido";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getSLAStatus = (deadline: string | null) => {
    if (!deadline) return "ok";
    const now = new Date();
    const slaDate = new Date(deadline);
    const diff = slaDate.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (diff < 0) return "breach";
    if (hours < 1) return "warning";
    return "ok";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Chamados</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os chamados de suporte
          </p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Chamados</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os chamados de suporte
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-ticket">
              <Plus className="mr-2 h-4 w-4" />
              Novo Chamado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Chamado</DialogTitle>
              <DialogDescription>
                Crie um novo chamado de suporte
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Impressora não está funcionando"
                          data-testid="input-ticket-title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o problema..."
                          rows={4}
                          data-testid="input-ticket-description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-ticket-priority">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createTicketMutation.isPending}
                    data-testid="button-submit-ticket"
                  >
                    {createTicketMutation.isPending ? "Criando..." : "Criar Chamado"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
                  {getTicketsByStatus(column.status).map((ticket) => {
                    const assignee = getUserById(ticket.assigneeId);
                    return (
                      <TicketCard
                        key={ticket.id}
                        id={ticket.ticketNumber}
                        title={ticket.title}
                        description={ticket.description || ""}
                        status={ticket.status}
                        priority={ticket.priority}
                        assignee={assignee ? { name: `${assignee.firstName} ${assignee.lastName}` } : undefined}
                        slaRemaining={formatSLARemaining(ticket.slaDeadline as any)}
                        slaStatus={getSLAStatus(ticket.slaDeadline as any) as any}
                        createdAt={formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                        onClick={() => console.log("Ticket clicked:", ticket.id)}
                      />
                    );
                  })}
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
              {tickets.map((ticket) => {
                const assignee = getUserById(ticket.assigneeId);
                return (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover-elevate"
                    onClick={() => console.log("Ticket clicked:", ticket.id)}
                    data-testid={`row-ticket-${ticket.id}`}
                  >
                    <TableCell className="font-mono text-xs">{ticket.ticketNumber}</TableCell>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.profileImageUrl || ""} />
                            <AvatarFallback className="text-xs">
                              {`${assignee.firstName?.[0] || ''}${assignee.lastName?.[0] || ''}`}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{`${assignee.firstName} ${assignee.lastName}`}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatSLARemaining(ticket.slaDeadline as any)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
