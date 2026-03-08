import { useState } from "react";
import { api } from "../services/api.service";
import { inputStyle, labelStyle } from "../styles/global.styles";
import Card from "../components/Card";
import ActionButton from "../components/ActionButton";

interface CancelarPageProps {
  onToast: (msg: string, type: string) => void;
}

export default function CancelarPage({ onToast }: CancelarPageProps) {
  const [paymentId, setPaymentId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCancel = async () => {
    if (!paymentId || !reason) return;
    setLoading(true);
    try {
      const res = await api.cancelPayment(paymentId, reason);
      setResult(res);
      onToast("Pago cancelado correctamente", "success");
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
          background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
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
          }}>🚫</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Pago Cancelado</h2>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
            La operación se completó correctamente
          </p>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {[
            { icon: "🔑", label: "ID del Pago", value: result.paymentId || paymentId },
            { icon: "📌", label: "Estado", value: result.status || "CANCELLED" },
            { icon: "💬", label: "Motivo", value: result.reason || reason },
            { icon: "✅", label: "Mensaje", value: result.message || "Pago cancelado" },
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
          <ActionButton onClick={resetForm} style={{ width: "100%" }}>Cancelar otro pago</ActionButton>
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
              width: 40, height: 40, borderRadius: 12, background: "var(--red-bg)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🚫</div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Cancelar Pago</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>Cancela un pago procesado previamente</p>
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
              onFocus={(e) => (e.target.style.borderColor = "var(--red)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>Motivo de Cancelación</label>
            <input
              placeholder="Ej: Pago duplicado, error en el monto..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--red)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        <ActionButton
          variant="danger"
          onClick={handleCancel}
          disabled={loading || !paymentId || !reason}
          style={{ width: "100%", marginTop: 20, padding: "14px", fontSize: "1rem" }}
        >
          {loading ? "Cancelando..." : "Cancelar Pago"}
        </ActionButton>
      </Card>
    </div>
  );
}
