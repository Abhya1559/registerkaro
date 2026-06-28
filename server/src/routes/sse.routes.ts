import { Router } from "express";
import { streamEvents } from "../controller/sse.controllers";

const router = Router();

router.get("/:jobId", streamEvents);

export default router;
