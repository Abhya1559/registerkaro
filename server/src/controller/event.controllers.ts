import type { Request, Response } from "express";
import Event from "../models/events.model.js";
import { broadcast } from "../sse/sse.manager.js";
import jobsModel from "../models/jobs.model.js";

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Verify webhook secret
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const token = auth.replace("Bearer ", "");

    if (token !== process.env.WEBHOOK_SECRET) {
      res.status(403).json({
        success: false,
        message: "Invalid webhook secret",
      });
      return;
    }

    const { jobId, sequence, level, phase, step, message } = req.body;

    // Basic validation
    if (
      !jobId ||
      sequence === undefined ||
      !level ||
      !phase ||
      !step ||
      !message
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid event payload",
      });
      return;
    }

    const event = await Event.create({
      jobId,
      sequence,
      level,
      phase,
      step,
      message,
    });

    await jobsModel.findOneAndUpdate(
      { jobId },
      {
        phase,
        updatedAt: new Date(),
      },
    );

    // Broadcast to SSE clients
    broadcast(jobId, event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to save event",
    });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    const events = await Event.find({ jobId })
      .sort({
        sequence: 1,
      })
      .lean();

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch events",
    });
  }
};
