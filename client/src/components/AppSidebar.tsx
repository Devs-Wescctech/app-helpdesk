import {
  LayoutDashboard,
  Ticket,
  FolderKanban,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import type { User } from "@shared/schema";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Chamados",
    url: "/tickets",
    icon: Ticket,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Usuários",
    url: "/users",
    icon: Users,
  },
];

const secondaryItems = [
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Ajuda",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const typedUser = user as User | undefined;
  const userName = typedUser ? `${typedUser.firstName || ''} ${typedUser.lastName || ''}`.trim() || 'Usuário' : 'Usuário';
  const userInitials = typedUser 
    ? `${typedUser.firstName?.[0] || ''}${typedUser.lastName?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Ticket className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Helpdesk</h2>
            <p className="text-xs text-muted-foreground">Suporte TI</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={typedUser?.profileImageUrl || ''} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{typedUser?.email || ''}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs"
            data-testid="button-logout"
          >
            <a href="/api/logout">Sair</a>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
