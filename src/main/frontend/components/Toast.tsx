import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: string;
  onClose: () => void;
}

const COLORS: Record<string, string> = {
  success: "var(--green)",
  error: "var(--red)",
  info: "var(--blue)",
};

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const c = COLORS[type] || COLORS.info;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, padding: "14px 20px",
      borderRadius: 14, background: "var(--bg-card)", border: `1px solid ${c}30`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", fontSize: "0.87rem",
      color: c, animation: "fadeUp 0.3s ease", zIndex: 9999,
      maxWidth: 380, backdropFilter: "blur(16px)",
    }}>
      {message}
    </div>
  );
}
