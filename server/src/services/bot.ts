import { chromium } from "playwright";
import { emitEvent } from "./event.js";
import { updateJob } from "./jobs.services.js";

export async function startBot(jobId: string, pan: string) {
  let browser;
  let sequence = 1;

  try {
    // Job Started
    await updateJob(jobId, {
      phase: "OPEN_BROWSER",
      status: "RUNNING",
    });

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "OPEN_BROWSER",
      step: "LAUNCH",
      message: "Launching Chrome browser",
    });

    browser = await chromium.launch({
      channel: "chrome",
      headless: false,
      slowMo: 500,
      args: ["--no-sandbox"],
    });

    const context = await browser.newContext({
      viewport: {
        width: 1366,
        height: 768,
      },
      locale: "en-IN",
      timezoneId: "Asia/Kolkata",
      colorScheme: "light",
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();

    // Open Portal
    await updateJob(jobId, {
      phase: "OPEN_PORTAL",
    });

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "OPEN_PORTAL",
      step: "NAVIGATE",
      message: "Opening Income Tax Portal",
    });

    await page.goto("https://www.incometax.gov.in/iec/foportal/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Login
    await updateJob(jobId, {
      phase: "LOGIN",
    });

    await page.locator('a[aria-label="Login"]').click();

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "LOGIN",
      step: "CLICKED",
      message: "Login button clicked",
    });

    await page.waitForTimeout(5000);

    // Check page content
    const pageText = await page.textContent("body");

    if (pageText?.includes("Permission Denied")) {
      await updateJob(jobId, {
        phase: "FAILED",
        status: "FAILED",
        error: "Permission Denied",
      });

      await emitEvent({
        jobId,
        sequence: sequence++,
        level: "ERROR",
        phase: "LOGIN",
        step: "FAILED",
        message: "Portal returned Permission Denied",
      });

      return;
    }

    // Future steps
    // await page.fill(..., pan)
    // await page.click(...)
    // await waitForOTP()
    // await generatePassword()

    await updateJob(jobId, {
      phase: "COMPLETED",
      status: "SUCCESS",
      completedAt: new Date(),
    });

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "COMPLETED",
      step: "END",
      message: "Automation completed successfully",
    });
  } catch (error) {
    await updateJob(jobId, {
      phase: "FAILED",
      status: "FAILED",
      error:
        error instanceof Error ? error.message : "Unknown automation error",
    });

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "ERROR",
      phase: "FAILED",
      step: "EXCEPTION",
      message:
        error instanceof Error ? error.message : "Unknown automation error",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
