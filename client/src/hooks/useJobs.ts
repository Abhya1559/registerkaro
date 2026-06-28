import { useCallback, useEffect, useState } from "react";
import { getJobs, type Job } from "../api/jobs";

export default function useJobs(selectedJob: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getJobs();

      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const data = await getJobs();

        if (!cancelled) {
          setJobs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    jobs,
    loading,
    refreshJobs: fetchJobs,
  };
}
