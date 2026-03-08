import { useState, useEffect, useCallback } from "react";
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import type { Wallet, ToastState } from "../types/wallet.types";
import { api } from "../services/api.service";
import { globalCSS } from "../styles/global.styles";
import Toast from "../components/Toast";
import InicioPage from "../pages/InicioPage";
import EnviarPage from "../pages/EnviarPage";
import CancelarPage from "../pages/CancelarPage";
import ReembolsarPage from "../pages/ReembolsarPage";
import MovimientosPage from "../pages/MovimientosPage";
import HistorialPage from "../pages/HistorialPage";

export const config: ViewConfig = {
  menu: { order: 0, icon: 'line-awesome/svg/wallet-solid.svg' },
  title: 'Mi Billetera',
};

const NAV_TABS = [
  { key: "inicio", label: "Inicio", icon: "🏠" },
  { key: "enviar", label: "Enviar", icon: "📤" },
  { key: "movimientos", label: "Movimientos", icon: "📋" },
  { key: "historial", label: "Historial", icon: "📜" },
];

export default function WalletApp() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [health, setHealth] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [walletId, setWalletId] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    api.health().then(() => setHealth(true)).catch(() => setHealth(false));
    api.listWallets()
      .then((data) => setWallets(data))
      .catch(() => setWallets([]));
  }, []);

  const showToast = useCallback((message: string, type: string) => {
    setToast({ message, type });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{globalCSS}</style>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,6,11,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)", padding: "0 20px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60, maxWidth: 520, margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, var(--purple), var(--purple-dark))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
            }}>💳</div>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Wallet Pay
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px", borderRadius: 20,
            background: health ? "var(--green-bg)" : "var(--red-bg)",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: health ? "var(--green)" : "var(--red)",
              animation: health ? "pulse 2s infinite" : "none",
            }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: health ? "var(--green)" : "var(--red)" }}>
              {health ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 520, margin: "0 auto", padding: "20px 20px 100px" }}>
        {activeTab === "inicio" && (
          <InicioPage walletId={walletId} setWalletId={setWalletId} wallets={wallets} health={health} onToast={showToast} onNavigate={setActiveTab} />
        )}
        {activeTab === "enviar" && <EnviarPage walletId={walletId} wallets={wallets} onToast={showToast} />}
        {activeTab === "movimientos" && <MovimientosPage walletId={walletId} onToast={showToast} />}
        {activeTab === "cancelar" && <CancelarPage onToast={showToast} />}
        {activeTab === "reembolsar" && <ReembolsarPage onToast={showToast} />}
        {activeTab === "historial" && <HistorialPage walletId={walletId} wallets={wallets} onToast={showToast} />}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(6,6,11,0.92)", backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)", padding: "6px 0 env(safe-area-inset-bottom, 6px)",
        zIndex: 100,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-around",
          maxWidth: 520, margin: "0 auto",
        }}>
          {NAV_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              padding: "4px 8px", background: "none", border: "none",
              color: activeTab === tab.key ? "var(--purple-light)" : "var(--text-dim)",
              cursor: "pointer", transition: "color 0.2s", fontFamily: "var(--font)",
            }}>
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span style={{
                fontSize: "0.6rem", fontWeight: activeTab === tab.key ? 700 : 500,
              }}>{tab.label}</span>
              {activeTab === tab.key && (
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "var(--purple)", marginTop: 1,
                }} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
