/**
 * Dark-mode-only color palette for the post-login app flow (Home, Schedule,
 * Wallet, Payments, Settings, Profile, Pickup). Sourced from the Figma
 * "EDWIN ADU BOATENG's team library" Home screen frame (node 5494-26623),
 * and extended with a consistent premium/gold accent and a semantic status
 * palette derived from the same visual language for surfaces the frame
 * didn't cover directly (status pills, transaction states, etc.).
 *
 * Mirrors the approach used for the auth flow in `authDarkTheme.ts`: kept
 * separate from `ThemeContext`'s shared `LIGHT`/`DARK` tokens so light mode
 * is never touched. Every consumer should branch with
 * `isDark ? APP_DARK.x : <existing light literal>` and leave the light
 * value exactly as it was.
 */
export const APP_DARK = {
  bg: "#0D0D0D",
  // Elevated floating panels (the Home search/stats panel, sheets, drawers).
  surface: "#141519",
  // Bordered "outline" cards that sit directly on `bg` (action rows, list
  // items) — Figma draws these the same shade as the screen with just a
  // hairline border for definition.
  card: "#0D0D0D",
  cardAlt: "rgba(13,13,13,0.95)",

  border: "#18212E",
  borderStrong: "#383838",

  text: "#CCD7E0",
  textSub: "#64748A",
  textMuted: "#6F7A6C",

  iconBg: "#121212",

  // Solid accent green for small elements that shouldn't be translucent
  // (spinners, icons, filled indicators).
  accentGreen: "#60D96D",

  // Primary CTA buttons render as a translucent green in dark mode instead
  // of the solid brand green (#31973D/#34A853/etc.) used in light mode —
  // same treatment as the auth flow's buttons.
  buttonPrimaryBg: "rgba(96,217,109,0.5)",
  buttonPrimaryText: "#FFFFFF",

  // Bottom nav bar
  navBg: "#0D0D0D",
  navBorder: "#383838",
  navActivePillBg: "rgba(96,217,109,0.5)",

  // Canonical premium/gold accent — used for the "Plan future pickup /
  // Premium Tier" card, premium badges/banners, and locked-feature rows
  // anywhere else in the app (Wallet, Settings, Schedule).
  premiumBorder: "#D4AF37",
  premiumIconBg: "#1A1A1A",
  premiumButtonBg: "#79601A",
  premiumButtonText: "#FFEEA8",
  premiumLabelText: "#FFEEA8",
  // The small padlock icon next to "Upgrade to Gold..." is a darker,
  // muted gold-brown — distinct from the paler premiumLabelText used for
  // the text next to it (Figma node 5494-26689).
  premiumLockIcon: "#8D7000",

  // Semantic status colors for badges/pills (schedule status, transaction
  // status, payment state, etc.) — a light-on-translucent-dark treatment
  // consistent with the auth error toast, since Figma didn't spec these
  // directly but they need to read clearly on a near-black background.
  statusSuccessBg: "rgba(49,151,61,0.16)",
  statusSuccessText: "#4ADE80",
  statusSuccessBorder: "#31973D",

  statusWarningBg: "rgba(217,165,32,0.16)",
  statusWarningText: "#FBBF24",
  statusWarningBorder: "#D4AF37",

  statusErrorBg: "rgba(239,68,68,0.16)",
  statusErrorText: "#F87171",
  statusErrorBorder: "#EF4444",

  statusInfoBg: "rgba(59,130,246,0.16)",
  statusInfoText: "#60A5FA",
  statusInfoBorder: "#3B82F6",

  statusNeutralBg: "#18212E",
  statusNeutralText: "#94A3B8",
} as const;
