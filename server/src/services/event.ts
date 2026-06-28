import axios from "axios";
import { type AutomationEvent } from "./types";

export async function emitEvent(event: AutomationEvent) {
  try {
    await axios.post("http://localhost:3000/api/events", event);
  } catch (error) {
    console.error("Failed to emit event:", error);
  }
}
