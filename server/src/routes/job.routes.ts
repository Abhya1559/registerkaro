import { Router } from "express";

import {
  createJob,
  getAllJobs,
  getJob,
} from "../controller/checkDetails.controllers";

const router = Router();

router.post("/", createJob);

router.get("/", getAllJobs);

router.get("/:id", getJob);

export default router;
