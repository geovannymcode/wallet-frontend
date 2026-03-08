export interface Wallet {
  walletId: string;
  ownerName: string;
  currency?: string;
  balance?: number;
  avatar?: string;
}

export interface ToastState {
  message: string;
  type: string;
}
