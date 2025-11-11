import {
  users,
  tickets,
  ticketComments,
  slaTemplates,
  projects,
  projectTasks,
  projectMembers,
  type User,
  type UpsertUser,
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type TicketComment,
  type InsertTicketComment,
  type SlaTemplate,
  type InsertSlaTemplate,
  type Project,
  type InsertProject,
  type ProjectTask,
  type InsertProjectTask,
  type ProjectMember,
  type InsertProjectMember,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User>;
  
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getTicket(id: string): Promise<Ticket | undefined>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByStatus(status: string): Promise<Ticket[]>;
  updateTicket(id: string, data: Partial<InsertTicket>): Promise<Ticket>;
  deleteTicket(id: string): Promise<void>;
  
  createTicketComment(comment: InsertTicketComment): Promise<TicketComment>;
  getTicketComments(ticketId: string): Promise<TicketComment[]>;
  updateTicketComment(id: string, content: string): Promise<TicketComment>;
  deleteTicketComment(id: string): Promise<void>;
  
  getAllSlaTemplates(): Promise<SlaTemplate[]>;
  getSlaTemplate(id: string): Promise<SlaTemplate | undefined>;
  createSlaTemplate(template: InsertSlaTemplate): Promise<SlaTemplate>;
  updateSlaTemplate(id: string, data: Partial<InsertSlaTemplate>): Promise<SlaTemplate>;
  deleteSlaTemplate(id: string): Promise<void>;
  
  createProject(project: InsertProject): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  updateProject(id: string, data: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  createProjectTask(task: InsertProjectTask): Promise<ProjectTask>;
  getProjectTasks(projectId: string): Promise<ProjectTask[]>;
  updateProjectTask(id: string, data: Partial<InsertProjectTask>): Promise<ProjectTask>;
  deleteProjectTask(id: string): Promise<void>;
  
  addProjectMember(member: InsertProjectMember): Promise<ProjectMember>;
  getProjectMembers(projectId: string): Promise<ProjectMember[]>;
  removeProjectMember(projectId: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.active, true));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createTicket(ticketData: InsertTicket): Promise<Ticket> {
    const count = await db.select({ count: sql<number>`count(*)` }).from(tickets);
    const ticketNumber = `${new Date().getFullYear()}-${String(Number(count[0].count) + 1).padStart(4, '0')}`;
    
    const [ticket] = await db
      .insert(tickets)
      .values({ ...ticketData, ticketNumber })
      .returning();
    return ticket;
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return await db
      .select()
      .from(tickets)
      .where(eq(tickets.status, status as any))
      .orderBy(desc(tickets.createdAt));
  }

  async updateTicket(id: string, data: Partial<InsertTicket>): Promise<Ticket> {
    const [ticket] = await db
      .update(tickets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket;
  }

  async deleteTicket(id: string): Promise<void> {
    await db.delete(tickets).where(eq(tickets.id, id));
  }

  async createTicketComment(commentData: InsertTicketComment): Promise<TicketComment> {
    const [comment] = await db.insert(ticketComments).values(commentData).returning();
    return comment;
  }

  async getTicketComments(ticketId: string): Promise<TicketComment[]> {
    return await db
      .select()
      .from(ticketComments)
      .where(eq(ticketComments.ticketId, ticketId))
      .orderBy(ticketComments.createdAt);
  }

  async updateTicketComment(id: string, content: string): Promise<TicketComment> {
    const [comment] = await db
      .update(ticketComments)
      .set({ content })
      .where(eq(ticketComments.id, id))
      .returning();
    return comment;
  }

  async deleteTicketComment(id: string): Promise<void> {
    await db.delete(ticketComments).where(eq(ticketComments.id, id));
  }

  async getAllSlaTemplates(): Promise<SlaTemplate[]> {
    return await db.select().from(slaTemplates).where(eq(slaTemplates.active, true));
  }

  async getSlaTemplate(id: string): Promise<SlaTemplate | undefined> {
    const [template] = await db.select().from(slaTemplates).where(eq(slaTemplates.id, id));
    return template;
  }

  async createSlaTemplate(templateData: InsertSlaTemplate): Promise<SlaTemplate> {
    const [template] = await db.insert(slaTemplates).values(templateData).returning();
    return template;
  }

  async updateSlaTemplate(id: string, data: Partial<InsertSlaTemplate>): Promise<SlaTemplate> {
    const [template] = await db
      .update(slaTemplates)
      .set(data)
      .where(eq(slaTemplates.id, id))
      .returning();
    return template;
  }

  async deleteSlaTemplate(id: string): Promise<void> {
    await db.update(slaTemplates).set({ active: false }).where(eq(slaTemplates.id, id));
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async createProjectTask(taskData: InsertProjectTask): Promise<ProjectTask> {
    const [task] = await db.insert(projectTasks).values(taskData).returning();
    return task;
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    return await db
      .select()
      .from(projectTasks)
      .where(eq(projectTasks.projectId, projectId))
      .orderBy(projectTasks.position);
  }

  async updateProjectTask(id: string, data: Partial<InsertProjectTask>): Promise<ProjectTask> {
    const [task] = await db
      .update(projectTasks)
      .set(data)
      .where(eq(projectTasks.id, id))
      .returning();
    return task;
  }

  async deleteProjectTask(id: string): Promise<void> {
    await db.delete(projectTasks).where(eq(projectTasks.id, id));
  }

  async addProjectMember(memberData: InsertProjectMember): Promise<ProjectMember> {
    const [member] = await db.insert(projectMembers).values(memberData).returning();
    return member;
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return await db
      .select()
      .from(projectMembers)
      .where(eq(projectMembers.projectId, projectId));
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await db
      .delete(projectMembers)
      .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
