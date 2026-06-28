import api from "./axios";

export interface Job {
  jobId: string;
  pan: string;
  phase: string;
  status: "RUNNING" | "SUCCESS" | "FAILED";
  startedAt: string;
  completedAt?: string;
  error?: string;
}

interface GetJobsResponse {
  success: boolean;
  jobs: Job[];
}

interface GetJobResponse {
  success: boolean;
  job: Job;
}

interface CreateJobResponse {
  success: boolean;
  message: string;
  data: Job;
}

export async function getJobs(): Promise<Job[]> {
  const { data } = await api.get<GetJobsResponse>("/jobs");
  return data.jobs;
}

export async function getJob(jobId: string): Promise<Job> {
  const { data } = await api.get<GetJobResponse>(`/jobs/${jobId}`);
  return data.job;
}

export async function createJob(pan: string): Promise<Job> {
  const { data } = await api.post<CreateJobResponse>("/jobs", {
    pan,
  });

  return data.data;
}
