import type { AutomationEvent } from "../api/events";

interface Props {
  event: AutomationEvent;
}

const levelColors = {
  INFO: "text-blue-400",
  WARN: "text-yellow-400",
  ERROR: "text-red-400",
};

export default function EventItem({ event }: Props) {
  return (
    <div className="border-b border-slate-700 py-3 last:border-none">
      <div className="flex items-center justify-between">
        <span className={`font-semibold ${levelColors[event.level]}`}>
          {event.level}
        </span>

        <span className="text-xs text-slate-500">
          {new Date(
            event.createdAt ?? event.timestamp ?? Date.now(),
          ).toLocaleTimeString()}
        </span>
      </div>

      <div className="mt-1 text-sm text-cyan-400">{event.phase}</div>

      <div className="text-sm text-slate-300">{event.message}</div>
    </div>
  );
}
