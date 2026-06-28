import type { Request, Response } from "express";
import Event from "../models/events.model";
import { broadcast } from "../sse/sse.manager";

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = await Event.create(req.body);
    broadcast(event.jobId, event);
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to save event",
    });
  }
};
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const events = await Event.find({ jobId }).sort({
      sequence: 1,
    });

    res.json({
      success: true,
      events,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to fetch events",
    });
  }
};
