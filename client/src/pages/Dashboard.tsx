import { useState } from "react";

import Navbar from "../components/Navbar";
import MetricCard from "../components/MetricCards";
import JobsTable from "../components/JobsTable";
import EventConsole from "../components/EventConsole";
import Loader from "../components/Loader";
import StartJob from "../components/StartJobs";
import JobDetails from "../components/JobDetails";

import useJobs from "../hooks/useJobs";
import useEvents from "../hooks/useEvent";
import useJob from "../hooks/useJobs";

export default function Dashboard() {
  const [selectedJob, setSelectedJob] = useState("");
  const { jobs, loading, refreshJobs } = useJobs(selectedJob);
  const job = useJob(selectedJob);

  const events = useEvents(selectedJob, refreshJobs);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <StartJob
          onSuccess={async (jobId: string) => {
            await refreshJobs();
            setSelectedJob(jobId);
          }}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Jobs"
            value={jobs.length}
            color="text-blue-500"
          />

          <MetricCard
            title="Running"
            value={jobs.filter((job) => job.status === "RUNNING").length}
            color="text-yellow-400"
          />

          <MetricCard
            title="Success"
            value={jobs.filter((job) => job.status === "SUCCESS").length}
            color="text-green-400"
          />

          <MetricCard
            title="Failed"
            value={jobs.filter((job) => job.status === "FAILED").length}
            color="text-red-400"
          />
        </div>

        <JobsTable jobs={jobs} onSelect={setSelectedJob} />

        {selectedJob && job && (
          <div className="grid gap-8 lg:grid-cols-2">
            <JobDetails job={job} onClose={() => setSelectedJob("")} />

            <EventConsole events={events} />
          </div>
        )}
      </div>
    </div>
  );
}
