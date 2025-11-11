import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, FolderKanban, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

const mockProjects = [
  {
    id: "1",
    name: "Migração para Nuvem",
    description: "Migrar infraestrutura local para AWS",
    progress: 65,
    status: "in_progress" as ProjectStatus,
    dueDate: "15 Dez 2024",
    team: [
      { name: "João Silva" },
      { name: "Maria Santos" },
      { name: "Pedro Costa" },
    ],
    tasks: { total: 24, completed: 16 },
  },
  {
    id: "2",
    name: "Atualização de Software",
    description: "Atualizar todos os sistemas para versões mais recentes",
    progress: 30,
    status: "in_progress" as ProjectStatus,
    dueDate: "30 Nov 2024",
    team: [
      { name: "Ana Oliveira" },
      { name: "Carlos Lima" },
    ],
    tasks: { total: 18, completed: 5 },
  },
  {
    id: "3",
    name: "Implementação de VPN",
    description: "Configurar VPN para acesso remoto seguro",
    progress: 90,
    status: "review" as ProjectStatus,
    dueDate: "20 Nov 2024",
    team: [
      { name: "João Silva" },
    ],
    tasks: { total: 12, completed: 11 },
  },
  {
    id: "4",
    name: "Backup Automático",
    description: "Sistema automatizado de backup diário",
    progress: 100,
    status: "completed" as ProjectStatus,
    dueDate: "10 Nov 2024",
    team: [
      { name: "Maria Santos" },
      { name: "Pedro Costa" },
    ],
    tasks: { total: 8, completed: 8 },
  },
];

const statusConfig = {
  planning: { label: "Planejamento", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  in_progress: { label: "Em Progresso", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  review: { label: "Em Revisão", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
  completed: { label: "Concluído", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Projetos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie projetos de TI estilo Kanban
          </p>
        </div>
        <Button data-testid="button-new-project">
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
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
        {mockProjects.map((project) => (
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
                {project.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{project.dueDate}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>{project.tasks.completed}/{project.tasks.total} tarefas</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, idx) => (
                    <Avatar key={idx} className="h-7 w-7 border-2 border-card">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
