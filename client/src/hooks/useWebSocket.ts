import { useEffect, useRef, useCallback } from "react";
import { queryClient } from "@/lib/queryClient";

type WebSocketMessage = {
  event: string;
  data: any;
};

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.event) {
          case "ticket:created":
          case "ticket:updated":
          case "ticket:deleted":
            queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
            queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
            break;

          case "project:created":
          case "project:updated":
          case "project:deleted":
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            break;

          case "task:created":
          case "task:updated":
          case "task:deleted":
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            break;

          case "comment:created":
          case "comment:updated":
          case "comment:deleted":
            queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
            break;

          case "member:added":
          case "member:removed":
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            break;

          case "sla:created":
          case "sla:updated":
          case "sla:deleted":
            queryClient.invalidateQueries({ queryKey: ["/api/sla-templates"] });
            break;

          case "user:updated":
            queryClient.invalidateQueries({ queryKey: ["/api/users"] });
            break;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected, reconnecting in 3s...");
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return ws.current;
}
