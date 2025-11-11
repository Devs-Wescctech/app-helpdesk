import { TicketCard } from "../TicketCard";

export default function TicketCardExample() {
  return (
    <div className="p-4">
      <TicketCard
        id="2024-001"
        title="Impressora não está funcionando"
        description="A impressora do 3º andar parou de responder"
        status="open"
        priority="high"
        assignee={{ name: "João Silva" }}
        slaRemaining="3h 20m"
        slaStatus="ok"
        createdAt="Há 2 horas"
      />
    </div>
  );
}
