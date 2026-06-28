import type { AutomationEvent } from "./events";

const BASE_URL = "http://localhost:3000/api";

export function connectSSE<T = AutomationEvent>(
  jobId: string,
  callback: (event: T) => void,
): EventSource {
  const source = new EventSource(`${BASE_URL}/stream/${jobId}`);

  source.onopen = () => {
    console.log("✅ SSE Connected");
  };

  source.onmessage = (event: MessageEvent<string>) => {
    try {
      const data = JSON.parse(event.data) as T;
      callback(data);
    } catch (err) {
      console.error("Failed to parse SSE event:", err);
    }
  };

  source.onerror = (err) => {
    console.error("SSE Connection Error:", err);

    // Close the connection.
    // The hook can decide whether to reconnect.
    source.close();
  };

  return source;
}
