import { Router } from "express";
import { createEvent, getEvents } from "../controller/event.controllers";

const router = Router();

router.post("/", createEvent);
router.get("/:jobId", getEvents);
export default router;
