import jobsModel from "../models/jobs.model.js";

export async function updateJob(jobId: string, data: Record<string, unknown>) {
  await jobsModel.updateOne(
    { jobId },
    {
      $set: data,
    },
  );
}
