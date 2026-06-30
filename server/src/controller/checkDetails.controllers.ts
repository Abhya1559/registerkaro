import { type Request, type Response } from "express";
import { startBot } from "../services/bot.js";
import jobsModel from "../models/jobs.model.js";

const isValidPan = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
};

const maskPan = (pan: string): string => {
  return pan.toUpperCase().replace(/.(?=.{4})/g, "*");
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pan } = req.body;

    const requestId =
      (req.headers["x-request-id"] as string) || crypto.randomUUID();
    res.setHeader("X-Request-Id", requestId);

    if (!pan || !isValidPan(pan)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid PAN format. Must match standard alphanumeric shape (e.g., ABCDE1234F).",
      });
      return;
    }

    const cleanPan = pan.toUpperCase();
    const jobId = crypto.randomUUID();

    const jobData = await jobsModel.create({
      jobId,
      pan: maskPan(cleanPan),
      phase: "CREATED",
      status: "RUNNING",
    });
    void startBot(jobId, cleanPan, requestId).catch((err: any) => {
      console.error(
        `[Tracing-${requestId}] Worker initiation failure for Job ${jobId}:`,
        err,
      );
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: {
        jobId: jobData.jobId,
        pan: jobData.pan,
        phase: jobData.phase,
        status: jobData.status,
        startedAt: jobData.startedAt || new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getAllJobs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const jobs = await jobsModel.find().sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    jobs,
  });
};
export const getJob = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const job = await jobsModel.findOne({
    jobId: id,
  });

  if (!job) {
    res.status(404).json({
      success: false,
      message: "Job not found",
    });

    return;
  }

  res.json({
    success: true,
    job,
  });
};
