interface MetricCardProps {
  title: string;
  value: number;
  color: string;
}

const MetricCard = ({ title, value, color }: MetricCardProps) => {
  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-md">
      <p className="text-slate-400">{title}</p>

      <h2 className={`mt-2 text-4xl font-bold ${color}`}>{value}</h2>
    </div>
  );
};

export default MetricCard;
