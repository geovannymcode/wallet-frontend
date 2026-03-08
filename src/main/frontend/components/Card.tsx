interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Card({ children, style: extra }: CardProps) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 20, padding: 24, animation: "fadeUp 0.4s ease", ...extra,
    }}>
      {children}
    </div>
  );
}
