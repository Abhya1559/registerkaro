import { useEffect, useState } from "react";
import { getEvents, type AutomationEvent } from "../api/event";
import { connectSSE } from "../api/sse";

export default function useEvents(
  jobId: string,
  refreshJobs?: () => Promise<void> | void,
) {
  const [events, setEvents] = useState<AutomationEvent[]>([]);

  useEffect(() => {
    if (!jobId) {
      setEvents([]);
      return;
    }

    let source: EventSource | null = null;

    const initialize = async () => {
      try {
        // Load previous events
        const history = await getEvents(jobId);
        setEvents(history);

        // Start live updates
        source = connectSSE<AutomationEvent>(jobId, (event) => {
          setEvents((prev) => [...prev, event]);

          // Refresh jobs table so phase/status changes immediately
          if (refreshJobs) {
            void refreshJobs();
          }
        });
      } catch (error) {
        console.error("Failed to initialize events:", error);
      }
    };

    void initialize();

    return () => {
      source?.close();
    };
  }, [jobId, refreshJobs]);

  return events;
}
