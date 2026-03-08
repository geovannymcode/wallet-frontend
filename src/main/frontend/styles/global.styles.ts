export const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg: #06060b;
  --bg-card: #0d0d14;
  --bg-elevated: #13131c;
  --bg-input: #0a0a11;
  --border: #1c1c2a;
  --border-hover: #2a2a3d;
  --text: #ededf0;
  --text-sub: #8888a0;
  --text-dim: #50506a;
  --purple: #8b5cf6;
  --purple-light: #a78bfa;
  --purple-dark: #7c3aed;
  --purple-glow: rgba(139,92,246,0.15);
  --green: #10b981;
  --green-bg: rgba(16,185,129,0.08);
  --red: #ef4444;
  --red-bg: rgba(239,68,68,0.08);
  --orange: #f59e0b;
  --orange-bg: rgba(245,158,11,0.08);
  --blue: #3b82f6;
  --blue-bg: rgba(59,130,246,0.08);
  --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --mono: 'JetBrains Mono', monospace;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--text); font-family:var(--font); -webkit-font-smoothing:antialiased; line-height:1.5; }
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes spin { to{transform:rotate(360deg)} }
`;

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  border: "1px solid var(--border)", background: "var(--bg-input)",
  color: "var(--text)", fontFamily: "var(--font)", fontSize: "0.93rem",
  outline: "none", transition: "border-color 0.2s",
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: "pointer", appearance: "none" as any,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238888a0' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  paddingRight: 36,
};

export const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", fontWeight: 600,
  color: "var(--text-sub)", marginBottom: 6, letterSpacing: "0.3px",
};
