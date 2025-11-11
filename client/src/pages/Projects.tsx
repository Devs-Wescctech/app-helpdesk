import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, FolderKanban, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { Project, ProjectTask, ProjectMember, User } from "@shared/schema";
import { insertProjectSchema } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

const statusConfig = {
  planning: { label: "Planejamento", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  in_progress: { label: "Em Progresso", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  review: { label: "Em Revisão", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
  completed: { label: "Concluído", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
};

const projectFormSchema = insertProjectSchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["planning", "in_progress", "review", "completed"]),
}).omit({
  ownerId: true,
  dueDate: true,
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planning",
    },
  });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar projeto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    createProjectMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Projetos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie projetos de TI estilo Kanban
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Projetos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie projetos de TI estilo Kanban
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-project">
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Projeto</DialogTitle>
              <DialogDescription>
                Crie um novo projeto de TI
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Migração para Nuvem"
                          data-testid="input-project-name"
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
                          placeholder="Descreva o projeto..."
                          rows={4}
                          data-testid="input-project-description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">Planejamento</SelectItem>
                          <SelectItem value="in_progress">Em Progresso</SelectItem>
                          <SelectItem value="review">Em Revisão</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createProjectMutation.isPending}
                    data-testid="button-submit-project"
                  >
                    {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar projetos..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-projects"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const owner = users.find((u) => u.id === project.ownerId);
          return (
            <Card
              key={project.id}
              className="cursor-pointer hover-elevate active-elevate-2 transition-shadow"
              onClick={() => console.log("Project clicked:", project.id)}
              data-testid={`card-project-${project.id}`}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className={statusConfig[project.status].color}>
                    {statusConfig[project.status].label}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {project.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description || "Sem descrição"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {project.dueDate
                        ? format(new Date(project.dueDate), "dd MMM yyyy", { locale: ptBR })
                        : "Sem prazo"}
                    </span>
                  </div>
                </div>

                {owner && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border-2 border-card">
                      <AvatarImage src={owner.profileImageUrl || ""} />
                      <AvatarFallback className="text-xs">
                        {`${owner.firstName?.[0] || ''}${owner.lastName?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {`${owner.firstName} ${owner.lastName}`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
