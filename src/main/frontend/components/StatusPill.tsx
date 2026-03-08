interface StatusPillProps {
  status: string;
}

const STATUS_MAP: Record<string, { c: string; bg: string; t: string }> = {
  PROCESSED: { c: "var(--green)", bg: "var(--green-bg)", t: "Completado" },
  CANCELLED: { c: "var(--red)", bg: "var(--red-bg)", t: "Cancelado" },
  REFUNDED: { c: "var(--orange)", bg: "var(--orange-bg)", t: "Reembolsado" },
};

export default function StatusPill({ status }: StatusPillProps) {
  const s = STATUS_MAP[status] || { c: "var(--text-dim)", bg: "var(--bg-elevated)", t: status };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600,
      color: s.c, background: s.bg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.c }} />
      {s.t}
    </span>
  );
}
