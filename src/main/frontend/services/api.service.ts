import { API_BASE } from "../config/api.config";
import type { Wallet } from "../types/wallet.types";

export const api = {
  async listWallets(): Promise<Wallet[]> {
    const res = await fetch(`${API_BASE}/wallets`);
    if (!res.ok) throw new Error("No se pudieron cargar las billeteras");
    return res.json();
  },

  async processPayment(data: any) {
    const res = await fetch(`${API_BASE}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async cancelPayment(id: string, reason: string) {
    const res = await fetch(`${API_BASE}/payments/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async refundPayment(id: string, reason: string) {
    const res = await fetch(`${API_BASE}/payments/${id}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async listPayments(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    );
    const res = await fetch(`${API_BASE}/payments?${qs}`);
    return res.json();
  },

  async getPayment(id: string) {
    const res = await fetch(`${API_BASE}/payments/${id}`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getHistory(walletId: string, limit = 20) {
    const res = await fetch(
      `${API_BASE}/payments/history/${walletId}?limit=${limit}`
    );
    return res.json();
  },

  async health() {
    const res = await fetch(`${API_BASE}/payments/health`);
    return res.json();
  },
};
