/**
 * Dark-mode-only color palette for the authentication flow (sign in/up, OTP
 * verification + resend, and the welcome-back / accept-terms screens).
 *
 * Sourced from the Figma "EDWIN ADU BOATENG's team library" dark-mode frames:
 *   - Sign in (phone / Google / Email)     node 5494-24460
 *   - Wrong number / wrong OTP toast        node 5494-24384
 *   - Resend OTP modal                      node 5494-25774
 *   - Welcome back / accept terms           node 5494-25894
 *
 * These are deliberately kept separate from `ThemeContext`'s shared `DARK`
 * tokens: they only apply inside the auth flow, so enabling dark mode
 * elsewhere in the app (Settings, Home, Wallet, etc.) is unaffected, and
 * light mode never changes. Every consumer should branch with
 * `isDark ? AUTH_DARK.x : <existing light value>` and leave the light value
 * untouched.
 */
export const AUTH_DARK = {
  bg: "#0D0D0D",
  card: "#111111",

  border: "#18212E",
  borderError: "#6E3C3B",

  text: "#CCD7E0",
  textMuted: "#656F77",
  textDisclaimer: "#707579",

  avatarBg: "rgba(255,255,255,0.2)",

  // Solid accent green used for small elements (e.g. a filled OTP digit
  // border) that shouldn't be translucent.
  accentGreen: "#60D96D",

  // Primary CTA buttons (Continue / Resend) render as a translucent green
  // in dark mode instead of the solid brand green used in light mode.
  buttonPrimaryBg: "rgba(96,217,109,0.5)",
  buttonPrimaryText: "#FFFFFF",

  buttonSecondaryBg: "#0D0D0D",
  buttonSecondaryBorder: "#18212E",
  buttonSecondaryText: "#CCD7E0",

  // Error toast (wrong number / wrong OTP): a light pill on the dark
  // background rather than the pastel-on-white toast used in light mode.
  toastBg: "#D8D8D8",
  toastBorder: "#6E3C3B",
  toastIconBg: "#F472B5",
  toastText: "#E50B78",
} as const;
