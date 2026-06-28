import { chromium } from "@playwright/test";

export async function createBrowser() {
  return chromium.launch({
    headless: false,
  });
}
