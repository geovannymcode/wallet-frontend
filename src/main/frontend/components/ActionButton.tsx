interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost";
  disabled?: boolean;
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { background: "var(--purple)", color: "#fff", border: "none" },
  danger: { background: "var(--red)", color: "#fff", border: "none" },
  ghost: { background: "transparent", color: "var(--text-sub)", border: "1px solid var(--border)" },
};

export default function ActionButton({ children, onClick, variant = "primary", disabled, style: extra }: ActionButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "11px 24px", borderRadius: 12, fontFamily: "var(--font)",
      fontWeight: 600, fontSize: "0.9rem", cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
      ...VARIANT_STYLES[variant], ...extra,
    }}>
      {children}
    </button>
  );
}
