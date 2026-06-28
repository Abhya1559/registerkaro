import type { AutomationEvent } from "../api/events";
import EmptyState from "./EmptyState";
import EventItem from "./EventItem";

interface Props {
  events: AutomationEvent[];
}

export default function EventConsole({ events }: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
      <div className="border-b border-slate-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Live Automation Logs</h2>
      </div>

      <div className="max-h-112.5 overflow-y-auto p-6">
        {events.length === 0 ? (
          <EmptyState message="No events available." />
        ) : (
          <div className="space-y-2">
            {events.map((event, index) => (
              <EventItem key={`${event.sequence}-${index}`} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
