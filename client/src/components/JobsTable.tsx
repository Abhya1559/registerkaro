import type { Job } from "../api/jobs";
import EmptyState from "./EmptyState";
import JobRow from "./JobRow";

interface Props {
  jobs: Job[];
  onSelect?: (jobId: string) => void;
}

export default function JobsTable({ jobs, onSelect }: Props) {
  if (jobs.length === 0) {
    return <EmptyState message="No automation jobs found." />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                Job ID
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                PAN
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                Phase
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                Status
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-slate-300">
                Started At
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-slate-300">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <JobRow key={job.jobId} job={job} onSelect={onSelect} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
