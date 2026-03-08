import { useState } from "react";
import type { Wallet } from "../types/wallet.types";
import { api } from "../services/api.service";
import { inputStyle, selectStyle, labelStyle } from "../styles/global.styles";
import Card from "../components/Card";
import ActionButton from "../components/ActionButton";
import WalletSelect from "../components/WalletSelect";

interface EnviarPageProps {
  walletId: string;
  wallets: Wallet[];
  onToast: (msg: string, type: string) => void;
}

export default function EnviarPage({ walletId, wallets, onToast }: EnviarPageProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ recipientWalletId: "", amount: "", currency: "USD", concept: "" });
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");

  const senderWallet = wallets.find((w) => w.walletId === walletId);
  const recipientWallet = wallets.find((w) => w.walletId === form.recipientWalletId);

  const handleSend = async () => {
    if (form.recipientWalletId === walletId) {
      onToast("No puedes enviarte dinero a ti mismo", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await api.processPayment({
        walletId,
        amount: parseFloat(form.amount),
        currency: form.currency,
        recipientWalletId: form.recipientWalletId,
        concept: form.concept,
      });
      setResult(res);
      setStep("done");
      onToast("Transferencia enviada correctamente", "success");
    } catch (err: any) {
      onToast(`Error: ${err?.message || JSON.stringify(err)}`, "error");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep("form");
    setResult(null);
    setForm({ recipientWalletId: "", amount: "", currency: "USD", concept: "" });
  };

  if (!walletId) {
    return (
      <Card style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>Configura tu billetera</h3>
        <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
          Ve a Inicio y selecciona tu billetera para enviar dinero
        </p>
      </Card>
    );
  }

  if (step === "done" && result) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp 0.4s ease" }}>
        <Card style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "var(--green-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 20px",
          }}>✓</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Transferencia Enviada</h2>
          <p style={{ color: "var(--text-sub)", fontSize: "0.9rem", marginBottom: 20 }}>
            Se envió <strong>${parseFloat(form.amount).toLocaleString()} {form.currency}</strong> a{" "}
            <strong>{recipientWallet?.ownerName || form.recipientWalletId}</strong>
          </p>
          <div style={{
            background: "var(--bg-elevated)", borderRadius: 12, padding: "12px 16px",
            fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-dim)",
            wordBreak: "break-all",
          }}>
            ID: {result.paymentId}
          </div>
          <div style={{ marginTop: 24 }}>
            <ActionButton onClick={resetForm}>Enviar otro pago</ActionButton>
          </div>
        </Card>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp 0.3s ease" }}>
        <Card>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
            Confirmar Transferencia
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Desde", value: `${senderWallet?.ownerName || walletId} (${walletId})` },
              { label: "Para", value: `${recipientWallet?.ownerName || form.recipientWalletId} (${form.recipientWalletId})` },
              { label: "Monto", value: `$${parseFloat(form.amount || "0").toLocaleString()} ${form.currency}` },
              { label: "Concepto", value: form.concept || "Sin concepto" },
            ].map((r) => (
              <div key={r.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0", borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-sub)" }}>{r.label}</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <ActionButton variant="ghost" onClick={() => setStep("form")} style={{ flex: 1 }}>
              Volver
            </ActionButton>
            <ActionButton onClick={handleSend} disabled={loading} style={{ flex: 1 }}>
              {loading ? "Enviando..." : "Confirmar Envío"}
            </ActionButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          padding: "14px 16px", background: "var(--bg-elevated)", borderRadius: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, var(--purple), var(--purple-dark))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff",
          }}>💳</div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Enviando desde</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", fontWeight: 600 }}>
              {senderWallet?.ownerName || walletId} ({walletId})
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WalletSelect
            wallets={wallets}
            value={form.recipientWalletId}
            onChange={(v) => setForm({ ...form, recipientWalletId: v })}
            label="Destinatario"
            exclude={walletId}
            placeholder="Selecciona la billetera destino"
          />

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Monto</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={{ ...inputStyle, fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.5px" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--purple)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label style={labelStyle}>Moneda</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                style={selectStyle}
              >
                <option value="USD">USD 🇺🇸</option>
                <option value="COP">COP 🇨🇴</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Concepto (opcional)</label>
            <input
              placeholder="¿Para qué es este pago?"
              value={form.concept}
              onChange={(e) => setForm({ ...form, concept: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--purple)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        <ActionButton
          onClick={() => setStep("confirm")}
          disabled={!form.recipientWalletId || !form.amount}
          style={{ width: "100%", marginTop: 20, padding: "14px", fontSize: "1rem" }}
        >
          Continuar
        </ActionButton>
      </Card>
    </div>
  );
}
