export interface AutomationEvent {
  jobId: string;
  sequence: number;
  level: "INFO" | "WARN" | "ERROR";
  phase: string;
  step: string;
  message: string;
}
