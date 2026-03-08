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
      <Card style={{ textAlign: "center", padding: "40px 24px", animation: "fadeUp 0.4s ease" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: "var(--red-bg)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 20px",
        }}>🚫</div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Pago Cancelado</h2>
        <p style={{ color: "var(--text-sub)", fontSize: "0.9rem", marginBottom: 20 }}>
          El pago <strong style={{ fontFamily: "var(--mono)" }}>{paymentId}</strong> ha sido cancelado.
        </p>
        <pre style={{
          fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-dim)",
          background: "var(--bg-elevated)", padding: "12px 16px", borderRadius: 12,
          overflowX: "auto", textAlign: "left", lineHeight: 1.6,
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
        <div style={{ marginTop: 24 }}>
          <ActionButton onClick={resetForm}>Cancelar otro pago</ActionButton>
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
