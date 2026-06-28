import { useEffect, useState } from "react";
import { getJob, type Job } from "../api/jobs";

export default function useJob(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }

    let cancelled = false;

    const fetchJob = async () => {
      try {
        setLoading(true);

        const data = await getJob(jobId);

        if (!cancelled) {
          setJob(data);
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);

        if (!cancelled) {
          setJob(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchJob();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return {
    job,
    loading,
  };
}
