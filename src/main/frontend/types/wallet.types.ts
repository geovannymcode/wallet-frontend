export interface Wallet {
  walletId: string;
  ownerName: string;
  currency?: string;
}

export interface ToastState {
  message: string;
  type: string;
}
