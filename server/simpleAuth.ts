import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  console.log('⚠️  Running in NO-AUTH mode (OIDC disabled)');
  console.log('   All users will have full access');
  
  app.set("trust proxy", 1);
  app.use(getSession());
  
  // No-auth mode: create fake endpoints
  app.get("/api/login", (req, res) => {
    res.redirect("/");
  });
  
  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });
  
  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });
}

// No authentication - allow all requests
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Set a fake user for compatibility
  (req as any).user = {
    claims: {
      sub: 'admin',
      email: 'admin@helpdesk.local',
      first_name: 'Admin',
      last_name: 'User'
    }
  };
  return next();
};
