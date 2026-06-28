interface Props {
  phase: string;
}

export default function PhaseBadge({ phase }: Props) {
  return (
    <span className="rounded bg-blue-600 px-3 py-1 text-xs text-white">
      {phase}
    </span>
  );
}
