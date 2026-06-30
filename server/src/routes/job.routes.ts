import { Router } from "express";

import {
  getAllJobs,
  createJob,
  getJob,
} from "../controller/checkDetails.controllers";

const router = Router();

router.post("/", createJob);

router.get("/", getAllJobs);

router.get("/:id", getJob);

export default router;
