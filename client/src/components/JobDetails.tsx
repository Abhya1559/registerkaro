import type { Job } from "../api/jobs";
import StatusBadge from "./StatusBadge";
import PhaseBadge from "./PhaseBadge";

interface Props {
  job: Job;
  onClose: () => void;
}

export default function JobDetails({ job, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-xl bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <h2 className="text-2xl font-bold">Job Details</h2>

          <button onClick={onClose} className="rounded bg-red-500 px-3 py-1">
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-slate-400">Job ID</p>
            <p className="font-mono">{job.jobId}</p>
          </div>

          <div>
            <p className="text-slate-400">PAN</p>
            <p>{job.pan}</p>
          </div>

          <div>
            <p className="text-slate-400">Phase</p>

            <PhaseBadge phase={job.phase} />
          </div>

          <div>
            <p className="text-slate-400">Status</p>

            <StatusBadge status={job.status} />
          </div>

          <div>
            <p className="text-slate-400">Started</p>

            <p>{new Date(job.startedAt).toLocaleString()}</p>
          </div>

          {job.completedAt && (
            <div>
              <p className="text-slate-400">Completed</p>

              <p>{new Date(job.completedAt).toLocaleString()}</p>
            </div>
          )}

          {job.error && (
            <div>
              <p className="text-red-400">Error</p>

              <p>{job.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
