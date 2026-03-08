import { useState } from "react";
import { api } from "../services/api.service";
import { inputStyle, labelStyle } from "../styles/global.styles";
import Card from "../components/Card";
import ActionButton from "../components/ActionButton";

interface ReembolsarPageProps {
  onToast: (msg: string, type: string) => void;
}

export default function ReembolsarPage({ onToast }: ReembolsarPageProps) {
  const [paymentId, setPaymentId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRefund = async () => {
    if (!paymentId || !reason) return;
    setLoading(true);
    try {
      const res = await api.refundPayment(paymentId, reason);
      setResult(res);
      onToast("Reembolso procesado correctamente", "success");
    } catch (err: any) {
      onToast(`Error: ${err?.message || JSON.stringify(err)}`, "error");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setResult(null);
    setPaymentId("");
    setReason("");
  };

  if (result) {
    return (
      <Card style={{ padding: 0, overflow: "hidden", animation: "fadeUp 0.4s ease" }}>
        <div style={{
          background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
          padding: "32px 24px 24px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -20, right: -20, width: 100, height: 100,
            borderRadius: "50%", background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 16px", backdropFilter: "blur(8px)",
          }}>↩️</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Reembolso Procesado</h2>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
            La operación se completó correctamente
          </p>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {[
            { icon: "🔑", label: "ID del Pago", value: result.paymentId || paymentId },
            { icon: "📌", label: "Estado", value: result.status || "REFUNDED" },
            { icon: "💬", label: "Motivo", value: result.reason || reason },
            { icon: "✅", label: "Mensaje", value: result.message || "Pago reembolsado" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
              borderBottom: i < 3 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)",
                border: "1px solid var(--border)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}>{row.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: 2 }}>{row.label}</div>
                <div style={{
                  fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", wordBreak: "break-all",
                  fontFamily: row.label === "ID del Pago" ? "var(--mono)" : "var(--font)",
                }}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
          <ActionButton onClick={resetForm} style={{ width: "100%", background: "var(--orange)", color: "#000", border: "none" }}>
            Reembolsar otro pago
          </ActionButton>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: "var(--orange-bg)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>↩️</div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Reembolsar Pago</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>Solicita el reembolso de un pago</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>ID del Pago</label>
            <input
              placeholder="Ingresa el Payment ID"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              style={{ ...inputStyle, fontFamily: "var(--mono)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--orange)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>Motivo del Reembolso</label>
            <input
              placeholder="Ej: Solicitud del cliente, producto defectuoso..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--orange)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        <ActionButton
          onClick={handleRefund}
          disabled={loading || !paymentId || !reason}
          style={{ width: "100%", marginTop: 20, padding: "14px", fontSize: "1rem", background: "var(--orange)", color: "#000", border: "none" }}
        >
          {loading ? "Procesando..." : "Solicitar Reembolso"}
        </ActionButton>
      </Card>
    </div>
  );
}
