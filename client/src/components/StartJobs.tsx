import { useState } from "react";
import { createJob } from "../api/jobs";

interface Props {
  onSuccess: (jobId: string) => void;
}

export default function StartJob({ onSuccess }: Props) {
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const formattedPan = pan.trim().toUpperCase();

    if (!formattedPan) {
      alert("Please enter PAN");
      return;
    }

    try {
      setLoading(true);

      const job = await createJob(formattedPan);

      setPan("");

      onSuccess(job.jobId);
    } catch (error) {
      console.error(error);
      alert("Failed to start automation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-slate-900 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-white">
        Start New Automation
      </h2>

      <div className="flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          maxLength={10}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Automation"}
        </button>
      </div>
    </div>
  );
}
