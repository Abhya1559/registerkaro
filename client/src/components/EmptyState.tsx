interface Props {
  message: string;
}

export default function EmptyState({ message }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 p-12 text-center text-slate-400">
      {message}
    </div>
  );
}
