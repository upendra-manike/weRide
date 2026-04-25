export const Theme = {
  colors: {
    background: '#0A0A0B',
    card: '#16161A',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    accent: '#10B981',
    border: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' as const },
    h2: { fontSize: 24, fontWeight: 'bold' as const },
    body: { fontSize: 16, fontWeight: 'normal' as const },
    caption: { fontSize: 12, color: '#94A3B8' },
  }
};
