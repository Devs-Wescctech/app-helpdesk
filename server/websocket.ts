import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export function setupWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const clients = new Set<AuthenticatedWebSocket>();

  wss.on("connection", (ws: AuthenticatedWebSocket) => {
    ws.isAlive = true;
    clients.add(ws);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === "auth") {
          ws.userId = message.userId;
        }

        if (message.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  const heartbeatInterval = setInterval(() => {
    clients.forEach((ws) => {
      if (!ws.isAlive) {
        clients.delete(ws);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  function broadcast(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  function sendToUser(userId: string, event: string, data: any) {
    const message = JSON.stringify({ event, data });
    clients.forEach((client) => {
      if (client.userId === userId && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  return { broadcast, sendToUser };
}

export type WebSocketManager = ReturnType<typeof setupWebSocket>;
