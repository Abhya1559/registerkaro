import type { Request, Response } from "express";
import { addClient, removeClient } from "../sse/sse.manager.js";

export const streamEvents = (req: Request, res: Response) => {
  const { jobId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  addClient(jobId, res);

  req.on("close", () => {
    removeClient(jobId, res);
  });
};
