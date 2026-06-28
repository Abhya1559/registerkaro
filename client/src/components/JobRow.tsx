import type { Job } from "../api/jobs";
import PhaseBadge from "./PhaseBadge";
import StatusBadge from "./StatusBadge";

interface Props {
  job: Job;
  onSelect?: (jobId: string) => void;
}

export default function JobRow({ job, onSelect }: Props) {
  return (
    <tr className="border-b border-slate-700 transition-colors hover:bg-slate-800">
      <td className="px-5 py-4 font-mono text-sm text-cyan-400">
        {job.jobId.slice(0, 8)}...
      </td>

      <td className="px-5 py-4 font-medium text-white">{job.pan}</td>

      <td className="px-5 py-4">
        <PhaseBadge phase={job.phase} />
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={job.status} />
      </td>

      <td className="px-5 py-4 text-sm text-slate-400">
        {new Date(job.startedAt).toLocaleString()}
      </td>

      <td className="px-5 py-4 text-center">
        <button
          onClick={() => onSelect?.(job.jobId)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Logs
        </button>
      </td>
    </tr>
  );
}
