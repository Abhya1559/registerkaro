import { type Request, type Response } from "express";
import { startBot } from "../services/bot.js";
import jobsModel from "../models/jobs.model.js";

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pan } = req.body;
    if (!pan) {
      res.status(400).json({
        success: false,
        message: "PAN is required",
      });
      return;
    }
    const jobData = await jobsModel.create({
      jobId: crypto.randomUUID(),
      pan,
      phase: "CREATED",
      status: "RUNNING",
    });
    void startBot(jobData.jobId, pan).catch((err: any) => {
      console.log("Bot failed", err);
    });
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: {
        jobId: jobData.jobId,
        pan: jobData.pan,
        phase: jobData.phase,
        status: jobData.status,
        startedAt: jobData.startedAt,
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
