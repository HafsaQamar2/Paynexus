import { Card } from "@/components/ui/Card";

export default function StatCard({ label, value, hint }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </Card>
  );
}
