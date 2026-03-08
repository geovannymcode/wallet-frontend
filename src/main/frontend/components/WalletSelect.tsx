import type { Wallet } from "../types/wallet.types";
import { selectStyle, labelStyle } from "../styles/global.styles";

interface WalletSelectProps {
  wallets: Wallet[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  exclude?: string;
  placeholder?: string;
}

export default function WalletSelect({ wallets, value, onChange, label, exclude, placeholder }: WalletSelectProps) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        <option value="">{placeholder || "Selecciona una billetera"}</option>
        {wallets
          .filter((w) => !exclude || w.walletId !== exclude)
          .map((w) => (
            <option key={w.walletId} value={w.walletId}>
              {w.ownerName} ({w.walletId})
            </option>
          ))}
      </select>
    </div>
  );
}
