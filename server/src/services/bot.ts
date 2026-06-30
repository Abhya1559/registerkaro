import { emitEvent } from "./event.js";
import { updateJob } from "./jobs.services.js";
import { chromium } from "playwright-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import jobsModel from "../models/jobs.model.js";

export async function startBot(jobId: string, pan: string, requestId: any) {
  let browser;
  let sequence = 1;

  try {
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

    chromium.use(stealthPlugin());
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

    await updateJob(jobId, {
      phase: "LOGIN",
    });

    const loginBtn = page.locator('a[aria-label="Login"]');
    await loginBtn.waitFor({ state: "visible" });
    await page.waitForTimeout(1000 + Math.random() * 1000);

    await loginBtn.click();

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "LOGIN",
      step: "CLICKED",
      message: "Login button clicked",
    });

    await page.waitForTimeout(4000);
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

    const userIdInput = page.locator('input[id="panAdhaarUserId"]');
    await userIdInput.waitFor({ state: "visible", timeout: 15000 });

    const maskedPan = pan.toUpperCase().replace(/.(?=.{4})/g, "*");
    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "LOGIN",
      step: "ENTERING_PAN",
      message: `Entering PAN: ${maskedPan}`,
    });

    await userIdInput.fill(pan.toUpperCase(), { delay: 100 });
    await page.waitForTimeout(1000);

    const continueBtn = page.locator("button.large-button-primary");
    await continueBtn.waitFor({ state: "visible", timeout: 15000 });

    const boundingBox = await continueBtn.boundingBox();
    if (boundingBox) {
      await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2,
      );
    }
    await page.waitForTimeout(500);
    await continueBtn.click({ force: true });

    let userPassword = "";
    const startTime = Date.now();

    while (!userPassword) {
      if (Date.now() - startTime > 180000) {
        throw new Error(
          "Timeout waiting for user password from control panel.",
        );
      }

      const currentJob = (await jobsModel.findOne({ jobId })) as any;
      if (currentJob?.userInput?.password) {
        userPassword = currentJob.userInput.password;
      } else {
        await page.waitForTimeout(3000);
      }
    }

    await updateJob(jobId, { phase: "LOGIN" });

    await emitEvent({
      jobId,
      sequence: sequence++,
      level: "INFO",
      phase: "LOGIN",
      step: "RESUMED",
      message: "Password received. Proceeding with authentication payload.",
    });
    const secureMsgCheckbox = page.locator(
      'label:has-text("Please confirm your secure access message displayed above")',
    );
    await secureMsgCheckbox.waitFor({ state: "visible", timeout: 5000 });
    await secureMsgCheckbox.dblclick({ force: true });

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.waitFor({ state: "visible", timeout: 15000 });

    await page.waitForTimeout(500);

    await passwordInput.fill(userPassword, { delay: 100 });
    await page.waitForTimeout(1000);

    const finalSubmitBtn = page.locator("button.large-button-primary");
    await finalSubmitBtn.waitFor({ state: "visible", timeout: 15000 });
    await finalSubmitBtn.click({ force: true });

    const welcomeText = page.locator('text="Welcome Back"');
    await welcomeText.waitFor({ state: "visible", timeout: 60000 });
    await page.waitForTimeout(3000);

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
