import { db } from "./db";
import { users, slaTemplates } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded");
    return;
  }

  const [admin] = await db
    .insert(users)
    .values([
      {
        firstName: "Admin",
        lastName: "Sistema",
        email: "admin@helpdesk.com",
        role: "admin",
        department: "TI",
        phone: "(11) 98765-4321",
      },
      {
        firstName: "João",
        lastName: "Silva",
        email: "joao.silva@helpdesk.com",
        role: "technician",
        department: "TI",
        phone: "(11) 98765-4322",
      },
      {
        firstName: "Maria",
        lastName: "Santos",
        email: "maria.santos@helpdesk.com",
        role: "technician",
        department: "TI",
        phone: "(11) 98765-4323",
      },
      {
        firstName: "Pedro",
        lastName: "Costa",
        email: "pedro.costa@helpdesk.com",
        role: "user",
        department: "Financeiro",
        phone: "(11) 98765-4324",
      },
    ])
    .returning();

  await db.insert(slaTemplates).values([
    {
      name: "Crítico",
      priority: "critical",
      responseTime: 30,
      resolutionTime: 120,
    },
    {
      name: "Alto",
      priority: "high",
      responseTime: 60,
      resolutionTime: 240,
    },
    {
      name: "Médio",
      priority: "medium",
      responseTime: 120,
      resolutionTime: 480,
    },
    {
      name: "Baixo",
      priority: "low",
      responseTime: 240,
      resolutionTime: 1440,
    },
  ]);

  console.log("Database seeded successfully");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
