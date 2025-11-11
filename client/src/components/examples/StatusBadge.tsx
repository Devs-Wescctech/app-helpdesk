import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 p-4 flex-wrap">
      <StatusBadge status="open" />
      <StatusBadge status="in_progress" />
      <StatusBadge status="waiting" />
      <StatusBadge status="resolved" />
      <StatusBadge status="closed" />
    </div>
  );
}
