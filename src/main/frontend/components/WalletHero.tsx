import type { Wallet } from "../types/wallet.types";

interface WalletHeroProps {
  wallet: Wallet | null;
  health: boolean;
}

export default function WalletHero({ wallet, health }: WalletHeroProps) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6366f1 100%)",
      borderRadius: 24, padding: "32px 28px", position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(124,58,237,0.2)",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 180, height: 180,
        borderRadius: "50%", background: "rgba(255,255,255,0.06)",
      }} />
      <div style={{
        position: "absolute", bottom: -30, right: 40, width: 120, height: 120,
        borderRadius: "50%", background: "rgba(255,255,255,0.04)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>
              {wallet?.avatar || "💳"}
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 1 }}>
                Mi Billetera
              </div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: "0.82rem", color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.5px",
              }}>
                {wallet ? wallet.walletId : "Sin configurar"}
              </div>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 20,
            background: health ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: health ? "#10b981" : "#ef4444",
              animation: health ? "pulse 2s infinite" : "none",
            }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: health ? "#10b981" : "#ef4444" }}>
              {health ? "Conectado" : "Sin conexión"}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
            {wallet ? wallet.ownerName : "Billetera Digital"}
          </div>
          {wallet?.balance != null ? (
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
              ${wallet.balance.toLocaleString()}
              <span style={{ fontSize: "0.9rem", fontWeight: 500, marginLeft: 6, color: "rgba(255,255,255,0.6)" }}>
                {wallet.currency || "USD"}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              Wallet Pay
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
