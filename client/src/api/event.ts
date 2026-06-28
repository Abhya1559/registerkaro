import api from "./axios";

export interface AutomationEvent {
  jobId: string;
  sequence: number;
  level: "INFO" | "WARN" | "ERROR";
  phase: string;
  step: string;
  message: string;
  timestamp?: string;
  createdAt?: string;
}

interface GetEventsResponse {
  success: boolean;
  events: AutomationEvent[];
}

export async function getEvents(jobId: string): Promise<AutomationEvent[]> {
  const { data } = await api.get<GetEventsResponse>(`/events/${jobId}`);

  return data.events;
}
