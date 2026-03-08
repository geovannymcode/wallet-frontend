import { useState, useEffect } from "react";
import type { Wallet } from "../types/wallet.types";
import { api } from "../services/api.service";
import Card from "../components/Card";
import ActionButton from "../components/ActionButton";
import WalletSelect from "../components/WalletSelect";

interface HistorialPageProps {
  walletId: string;
  wallets: Wallet[];
  onToast: (msg: string, type: string) => void;
}

const EVENT_META: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  PaymentProcessed: { color: "var(--green)", bg: "var(--green-bg)", icon: "💸", label: "Pago Procesado" },
  PaymentCancelled: { color: "var(--red)", bg: "var(--red-bg)", icon: "🚫", label: "Pago Cancelado" },
  PaymentRefunded: { color: "var(--orange)", bg: "var(--orange-bg)", icon: "↩️", label: "Pago Reembolsado" },
};

export default function HistorialPage({ walletId, wallets, onToast }: HistorialPageProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(walletId);

  useEffect(() => { setSelectedWallet(walletId); }, [walletId]);

  const fetchEvents = async () => {
    if (!selectedWallet) return;
    setLoading(true);
    try {
      const res = await api.getHistory(selectedWallet);
      setEvents(res.events || []);
    } catch {
      onToast("Error al cargar historial", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>Historial de Eventos</h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: 16 }}>
          Registro inmutable de todas las operaciones
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <WalletSelect
              wallets={wallets}
              value={selectedWallet}
              onChange={setSelectedWallet}
              label="Billetera"
              placeholder="Selecciona una billetera"
            />
          </div>
          <ActionButton onClick={fetchEvents} disabled={loading || !selectedWallet}>
            {loading ? "Cargando..." : "Buscar"}
          </ActionButton>
        </div>
      </Card>

      {events.length > 0 ? (
        <Card style={{ padding: 0 }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>
              {events.length} eventos encontrados
            </span>
          </div>
          <div style={{ position: "relative", padding: "16px 24px 16px 48px" }}>
            <div style={{
              position: "absolute", left: 33, top: 16, bottom: 16,
              width: 2, background: "var(--border)", borderRadius: 1,
            }} />

            {events.map((ev: any, i: number) => {
              const meta = EVENT_META[ev.eventType] || {
                color: "var(--text-dim)", bg: "var(--bg-elevated)", icon: "📌", label: ev.eventType,
              };
              return (
                <div key={i} style={{
                  position: "relative", paddingBottom: i < events.length - 1 ? 24 : 0,
                  animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                }}>
                  <div style={{
                    position: "absolute", left: -24, top: 4,
                    width: 12, height: 12, borderRadius: "50%",
                    background: meta.color, border: "3px solid var(--bg-card)",
                    zIndex: 1,
                  }} />

                  <div style={{
                    background: "var(--bg-elevated)", borderRadius: 14, padding: "14px 16px",
                    border: "1px solid var(--border)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{meta.icon}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: meta.color }}>
                          {meta.label}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
                        v{ev.version}
                      </span>
                    </div>
                    {ev.payload && (
                      <pre style={{
                        fontFamily: "var(--mono)", fontSize: "0.73rem", color: "var(--text-sub)",
                        background: "var(--bg-card)", padding: "8px 12px", borderRadius: 8,
                        overflowX: "auto", lineHeight: 1.6,
                      }}>
                        {JSON.stringify(ev.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : !loading && (
        <Card style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>📜</div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            Selecciona una billetera y presiona Buscar para ver su historial
          </p>
        </Card>
      )}
    </div>
  );
}
