import axios from "axios";
import { type AutomationEvent } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

const MAX_RETRIES = 3;

const BASE_DELAY = 500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function emitEvent(event: AutomationEvent): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await axios.post(`${API_URL}/api/events`, event, {
        headers: {
          Authorization: `Bearer ${WEBHOOK_SECRET}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });

      return;
    } catch (error) {
      attempt++;

      console.error(
        `Event ${event.sequence} failed. Attempt ${attempt}/${MAX_RETRIES}`,
      );

      if (attempt >= MAX_RETRIES) {
        console.error("Dropping event:", event);
        return;
      }

      const delay = BASE_DELAY * Math.pow(2, attempt - 1);

      await sleep(delay);
    }
  }
}
