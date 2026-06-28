interface Props {
  status: "RUNNING" | "SUCCESS" | "FAILED";
}

const colors = {
  RUNNING: "bg-yellow-500",
  SUCCESS: "bg-green-500",
  FAILED: "bg-red-500",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${colors[status]}`}
    >
      {status}
    </span>
  );
}
