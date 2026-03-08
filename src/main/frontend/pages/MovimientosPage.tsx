import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api.service";
import Card from "../components/Card";
import StatusPill from "../components/StatusPill";

interface MovimientosPageProps {
  walletId: string;
  onToast: (msg: string, type: string) => void;
}

export default function MovimientosPage({ walletId, onToast }: MovimientosPageProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<any>(null);

  const fetchPayments = useCallback(async () => {
    if (!walletId) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { walletId, limit: "20" };
      if (statusFilter) params.status = statusFilter;
      const res = await api.listPayments(params);
      setPayments(res.data || []);
      setTotal(res.total || 0);
    } catch {
      onToast("Error al cargar movimientos", "error");
    }
    setLoading(false);
  }, [walletId, statusFilter, onToast]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  if (!walletId) {
    return (
      <Card style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>Sin billetera configurada</h3>
        <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
          Ve a Inicio y selecciona tu billetera
        </p>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Movimientos</h3>
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
            {total} registros
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { value: "", label: "Todos" },
            { value: "PROCESSED", label: "Completados" },
            { value: "CANCELLED", label: "Cancelados" },
            { value: "REFUNDED", label: "Reembolsados" },
          ].map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{
              padding: "8px 16px", borderRadius: 10,
              border: statusFilter === f.value ? "1px solid var(--purple)" : "1px solid var(--border)",
              background: statusFilter === f.value ? "var(--purple-glow)" : "transparent",
              color: statusFilter === f.value ? "var(--purple-light)" : "var(--text-sub)",
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              fontFamily: "var(--font)",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>Cargando movimientos...</div>
        </Card>
      ) : payments.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📋</div>
          <div style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>No hay movimientos para mostrar</div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {payments.map((p: any, i: number) => (
            <div key={p.paymentId} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 24px", borderBottom: i < payments.length - 1 ? "1px solid var(--border)" : "none",
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`, cursor: "pointer",
              transition: "background 0.15s",
            }}
              onClick={() => setDetail(detail?.paymentId === p.paymentId ? null : p)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: p.status === "PROCESSED" ? "var(--green-bg)" :
                    p.status === "CANCELLED" ? "var(--red-bg)" : "var(--orange-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {p.status === "PROCESSED" ? "↗" : p.status === "CANCELLED" ? "✕" : "↩"}
                </div>
                <div>
                  <div style={{ fontSize: "0.87rem", fontWeight: 600 }}>
                    {p.concept || "Transferencia"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
                    → {p.recipientWalletId} · {p.paymentId?.slice(0, 8)}...
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.93rem", fontWeight: 700, marginBottom: 4 }}>
                  ${p.amount?.toLocaleString()} <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{p.currency}</span>
                </div>
                <StatusPill status={p.status} />
              </div>
            </div>
          ))}
        </Card>
      )}

      {detail && (
        <Card style={{ animation: "fadeUp 0.3s ease", padding: 0, overflow: "hidden" }}>
          <div style={{
            background: detail.status === "PROCESSED"
              ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
              : detail.status === "CANCELLED"
                ? "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"
                : "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
            padding: "24px 24px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -20, right: -20, width: 100, height: 100,
              borderRadius: "50%", background: "rgba(255,255,255,0.08)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                  Monto de la transacción
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
                  ${detail.amount?.toLocaleString()}
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, marginLeft: 6, opacity: 0.8 }}>
                    {detail.currency}
                  </span>
                </div>
              </div>
              <button onClick={() => setDetail(null)} style={{
                background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                width: 32, height: 32, borderRadius: 10, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}>✕</button>
            </div>
            <div style={{ marginTop: 12, position: "relative", zIndex: 1 }}>
              <StatusPill status={detail.status} />
            </div>
          </div>

          <div style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-sub)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Información del Pago
            </div>

            {[
              { icon: "🔑", label: "ID de Pago", value: detail.paymentId, mono: true },
              { icon: "💳", label: "Billetera Origen", value: detail.walletId, mono: true },
              { icon: "📩", label: "Billetera Destino", value: detail.recipientWalletId, mono: true },
              { icon: "💬", label: "Concepto", value: detail.concept || "Sin concepto", mono: false },
              { icon: "🕐", label: "Fecha", value: detail.createdAt ? new Date(detail.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "—", mono: false },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 0",
                borderBottom: i < 4 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--bg-elevated)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>
                  {row.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: 2 }}>
                    {row.label}
                  </div>
                  <div style={{
                    fontSize: "0.88rem", fontWeight: 600,
                    fontFamily: row.mono ? "var(--mono)" : "var(--font)",
                    color: "var(--text)",
                    wordBreak: "break-all",
                  }}>
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
