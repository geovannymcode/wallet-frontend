import { useState, useEffect, useCallback } from "react";
import type { Wallet } from "../types/wallet.types";
import { api } from "../services/api.service";
import Card from "../components/Card";
import WalletHero from "../components/WalletHero";
import WalletSelect from "../components/WalletSelect";
import StatusPill from "../components/StatusPill";

interface InicioPageProps {
  walletId: string;
  setWalletId: (v: string) => void;
  wallets: Wallet[];
  health: boolean;
  onToast: (msg: string, type: string) => void;
  onNavigate: (tab: string) => void;
}

export default function InicioPage({ walletId, setWalletId, wallets, health, onToast, onNavigate }: InicioPageProps) {
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const currentWallet = wallets.find((w) => w.walletId === walletId) || null;

  const loadRecent = useCallback(async () => {
    if (!walletId) return;
    setLoadingRecent(true);
    try {
      const res = await api.listPayments({ walletId, limit: "5" });
      setRecentPayments(res.data || []);
    } catch {
      setRecentPayments([]);
    }
    setLoadingRecent(false);
  }, [walletId]);

  useEffect(() => { loadRecent(); }, [loadRecent]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <WalletHero wallet={currentWallet} health={health} />

      <Card>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>Seleccionar Billetera</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
            {currentWallet ? `Hola, ${currentWallet.ownerName} 👋` : "Elige tu billetera para operar"}
          </p>
        </div>
        <WalletSelect
          wallets={wallets}
          value={walletId}
          onChange={setWalletId}
          label="Tu billetera"
          placeholder="Selecciona tu billetera"
        />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { icon: "📤", label: "Enviar", color: "var(--purple)", tab: "enviar" },
          { icon: "📋", label: "Movimientos", color: "var(--blue)", tab: "movimientos" },
          { icon: "🚫", label: "Cancelar Pago", color: "var(--red)", tab: "cancelar" },
          { icon: "↩️", label: "Reembolsar", color: "var(--orange)", tab: "reembolsar" },
        ].map((a) => (
          <div key={a.label} onClick={() => onNavigate(a.tab)} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "20px 16px", textAlign: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: a.color }}>{a.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Últimos Movimientos</h3>
          {loadingRecent && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Cargando...</span>
          )}
        </div>

        {recentPayments.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "32px 0",
            color: "var(--text-dim)", fontSize: "0.85rem",
          }}>
            {walletId ? "No hay movimientos recientes" : "Selecciona tu billetera para ver movimientos"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentPayments.map((p: any) => (
              <div key={p.paymentId} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 0", borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
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
                    <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                      → {p.recipientWalletId}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                    ${p.amount?.toLocaleString()} <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{p.currency}</span>
                  </div>
                  <StatusPill status={p.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
