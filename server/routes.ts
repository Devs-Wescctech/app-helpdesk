import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocket } from "./websocket";
import { insertTicketSchema, insertProjectSchema, insertProjectTaskSchema, insertSlaTemplateSchema } from "@shared/schema";
import { z } from "zod";

let wsManager: ReturnType<typeof setupWebSocket> | null = null;

// Load auth module dynamically
async function getAuthModule() {
  const useSimpleAuth = !process.env.ISSUER_URL || !process.env.ISSUER_URL.startsWith('https://');
  return useSimpleAuth 
    ? await import("./simpleAuth.js")
    : await import("./replitAuth.js");
}

export async function registerRoutes(app: Express): Promise<Server> {
  const { setupAuth, isAuthenticated } = await getAuthModule();
  await setupAuth(app);

  // Health check endpoint for Docker
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users", isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/tickets", isAuthenticated, async (req, res) => {
    try {
      const { status } = req.query;
      const tickets = status
        ? await storage.getTicketsByStatus(status as string)
        : await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post("/api/tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ticketData = insertTicketSchema.parse({
        ...req.body,
        requesterId: userId,
      });

      const slaTemplates = await storage.getAllSlaTemplates();
      const slaTemplate = slaTemplates.find(t => t.priority === ticketData.priority);
      
      if (slaTemplate) {
        const deadline = new Date();
        deadline.setMinutes(deadline.getMinutes() + slaTemplate.resolutionTime);
        ticketData.slaDeadline = deadline;
        ticketData.slaTemplateId = slaTemplate.id;
      }

      const ticket = await storage.createTicket(ticketData);
      
      if (wsManager) {
        wsManager.broadcast("ticket:created", ticket);
      }
      
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  app.patch("/api/tickets/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates: any = req.body;

      if (updates.status === "resolved" && !updates.resolvedAt) {
        updates.resolvedAt = new Date();
      }
      if (updates.status === "closed" && !updates.closedAt) {
        updates.closedAt = new Date();
      }

      const ticket = await storage.updateTicket(id, updates);
      
      if (wsManager) {
        wsManager.broadcast("ticket:updated", ticket);
      }
      
      res.json(ticket);
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  app.delete("/api/tickets/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTicket(id);
      
      if (wsManager) {
        wsManager.broadcast("ticket:deleted", { id });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ message: "Failed to delete ticket" });
    }
  });

  app.get("/api/tickets/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getTicketComments(id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/tickets/:id/comments", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const comment = await storage.createTicketComment({
        ticketId: id,
        userId,
        content: req.body.content,
        isInternal: req.body.isInternal || false,
      });
      
      if (wsManager) {
        wsManager.broadcast("comment:created", comment);
      }
      
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.patch("/api/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const comment = await storage.updateTicketComment(id, content);
      
      if (wsManager) {
        wsManager.broadcast("comment:updated", comment);
      }
      
      res.json(comment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });

  app.delete("/api/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTicketComment(id);
      
      if (wsManager) {
        wsManager.broadcast("comment:deleted", { id });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  app.get("/api/sla-templates", isAuthenticated, async (req, res) => {
    try {
      const templates = await storage.getAllSlaTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching SLA templates:", error);
      res.status(500).json({ message: "Failed to fetch SLA templates" });
    }
  });

  app.post("/api/sla-templates", isAuthenticated, async (req, res) => {
    try {
      const templateData = insertSlaTemplateSchema.parse(req.body);
      const template = await storage.createSlaTemplate(templateData);
      
      if (wsManager) {
        wsManager.broadcast("sla:created", template);
      }
      
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid SLA template data", errors: error.errors });
      }
      console.error("Error creating SLA template:", error);
      res.status(500).json({ message: "Failed to create SLA template" });
    }
  });

  app.patch("/api/sla-templates/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.updateSlaTemplate(id, req.body);
      
      if (wsManager) {
        wsManager.broadcast("sla:updated", template);
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error updating SLA template:", error);
      res.status(500).json({ message: "Failed to update SLA template" });
    }
  });

  app.delete("/api/sla-templates/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSlaTemplate(id);
      
      if (wsManager) {
        wsManager.broadcast("sla:deleted", { id });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting SLA template:", error);
      res.status(500).json({ message: "Failed to delete SLA template" });
    }
  });

  app.get("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        ownerId: userId,
      });

      const project = await storage.createProject(projectData);
      
      if (wsManager) {
        wsManager.broadcast("project:created", project);
      }
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.updateProject(id, req.body);
      
      if (wsManager) {
        wsManager.broadcast("project:updated", project);
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      
      if (wsManager) {
        wsManager.broadcast("project:deleted", { id });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.get("/api/projects/:id/tasks", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await storage.getProjectTasks(id);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      res.status(500).json({ message: "Failed to fetch project tasks" });
    }
  });

  app.post("/api/projects/:id/tasks", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const taskData = insertProjectTaskSchema.parse({
        ...req.body,
        projectId: id,
      });

      const task = await storage.createProjectTask(taskData);
      
      if (wsManager) {
        wsManager.broadcast("task:created", task);
      }
      
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/projects/:projectId/tasks/:taskId", isAuthenticated, async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await storage.updateProjectTask(taskId, req.body);
      
      if (wsManager) {
        wsManager.broadcast("task:updated", task);
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/projects/:projectId/tasks/:taskId", isAuthenticated, async (req, res) => {
    try {
      const { taskId } = req.params;
      await storage.deleteProjectTask(taskId);
      
      if (wsManager) {
        wsManager.broadcast("task:deleted", { id: taskId });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  app.get("/api/projects/:id/members", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const members = await storage.getProjectMembers(id);
      res.json(members);
    } catch (error) {
      console.error("Error fetching project members:", error);
      res.status(500).json({ message: "Failed to fetch project members" });
    }
  });

  app.post("/api/projects/:id/members", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const member = await storage.addProjectMember({
        projectId: id,
        userId: req.body.userId,
        role: req.body.role || "member",
      });
      
      if (wsManager) {
        wsManager.broadcast("member:added", member);
      }
      
      res.status(201).json(member);
    } catch (error) {
      console.error("Error adding project member:", error);
      res.status(500).json({ message: "Failed to add project member" });
    }
  });

  app.delete("/api/projects/:id/members/:userId", isAuthenticated, async (req, res) => {
    try {
      const { id, userId } = req.params;
      await storage.removeProjectMember(id, userId);
      
      if (wsManager) {
        wsManager.broadcast("member:removed", { projectId: id, userId });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing project member:", error);
      res.status(500).json({ message: "Failed to remove project member" });
    }
  });

  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const allTickets = await storage.getAllTickets();
      
      const stats = {
        totalTickets: allTickets.length,
        openTickets: allTickets.filter(t => t.status === "open").length,
        inProgressTickets: allTickets.filter(t => t.status === "in_progress").length,
        resolvedTickets: allTickets.filter(t => t.status === "resolved").length,
        criticalTickets: allTickets.filter(t => t.priority === "critical").length,
        slaBreach: allTickets.filter(t => t.slaBreach).length,
        avgResponseTime: 2.4,
        avgResolutionTime: 8.5,
        resolutionRate: 94,
        serviceLevel: 96,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  wsManager = setupWebSocket(httpServer);
  
  return httpServer;
}

export function getWebSocketManager() {
  return wsManager;
}
