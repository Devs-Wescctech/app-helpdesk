import { PriorityBadge } from "../PriorityBadge";

export default function PriorityBadgeExample() {
  return (
    <div className="flex gap-2 p-4 flex-wrap">
      <PriorityBadge priority="critical" />
      <PriorityBadge priority="high" />
      <PriorityBadge priority="medium" />
      <PriorityBadge priority="low" />
    </div>
  );
}
