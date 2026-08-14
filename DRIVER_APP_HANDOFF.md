# Zubba Driver App — Engineering Handoff

Status: Audit v1
Companion to: `docs/DRIVER_APP_SPEC.md` (requirements/spec) — this document is the **implementation-grounding companion**: exact file paths, signatures, and verbatim snippets from the existing customer app so a brand-new Driver App repo can be built to match without access to this codebase.

Audited repo: `c:\Users\ZakariaOsman\Desktop\Zubba` (branch `refactor`, as of 2026-08-02).

---

## 1. Stack detection

Confirmed by reading `package.json`, `app.json`, `app.config.ts`, `tsconfig.json`, `babel.config.js`.

### Framework
- **Expo**, not bare RN CLI. `package.json` → `"expo": "~57.0.8"` (Expo SDK 57). `main` is `"expo/AppEntry"`.
- Two config files both exist: `app.json` (static, app name `"Zubba Customer"`) and `app.config.ts` (dynamic, also `"Zubba Customer"`, loads `dotenv/config`). `app.config.ts` is the one actually used at build time (it re-exports/extends `config` from `app.json` and adds `extra.apiUrl`, Google/Paystack/Supabase keys read from `process.env`). Scheme differs between the two files: `app.json` has `"scheme": "com.zubba.app"`, `app.config.ts` has `"scheme": "zubbafrontend"` — an inconsistency in the current repo itself.
- `react-native`: `0.86.0`. `react`: `19.2.3`. New Architecture is implied by RN 0.86 + `react-native-worklets`/`reanimated 4.5.0`.
- Bundle IDs: iOS `com.zubbadevs.zubba`, Android `com.zubba.app`.

### Navigation
- `@react-navigation/native` `^6.1.18` + `@react-navigation/native-stack` `^6.11.0`.
- **Single flat native stack** — see §5. There is no bottom-tab-navigator package in `package.json`; the pill-style bottom nav (`AppBottomNav.tsx`) is a hand-rolled `View` positioned absolutely over stack screens, not a react-navigation tab navigator.

### State management
- **Redux Toolkit**, confirmed: `@reduxjs/toolkit ^2.2.6`, `react-redux ^9.1.2`, `redux-persist ^6.0.0` (present in deps but the store in `src/store/index.ts` does NOT currently wrap the root reducer in `persistReducer` — persistence for auth is instead done manually via `src/utils/authStorage.ts` / `src/slices/auth/hydrateAuth.ts` using AsyncStorage directly; see §6).
- `@tanstack/react-query ^5.101.0` is also used, alongside Redux, for server-state (mutations like register/verify-otp are React Query `useMutation` hooks wrapping the axios-based `authService`; see `src/slices/auth/auth.hooks.ts`).

### Styling
- **Mixed, NativeWind-first**: `nativewind ^4.2.5` + `tailwindcss ^3.4.19`, configured via `tailwind.config.js` (content globs `./App.{js,jsx,ts,tsx}`, `./app/**/*`, `./src/**/*`; presets: `nativewind/preset`; `theme.extend: {}` — **no custom design tokens registered in Tailwind**, all color values are inlined as Tailwind arbitrary-value classes like `bg-[#31973D]` or as raw RN `StyleSheet`-style objects) and `global.css` (just the 3 `@tailwind` directives, no custom CSS).
- Babel: `nativewind/babel` preset registered in `babel.config.js` alongside `babel-preset-expo`, plus `module-resolver` (`@` → `./src`) and `react-native-reanimated/plugin`.
- In practice, most screens use **inline `style={{...}}` objects** built from `scale()`/`moderateScale()` (see §8) for anything numeric/theme-dependent (because Tailwind classes can't consume runtime theme colors), with NativeWind `className` used for static layout utility classes (flex, gap, rounded corners, etc.) layered on top. Some components use NativeWind almost exclusively (`Button.tsx`, `RoundedButton.tsx`, `PickupRequestModal.tsx`), others almost none (`PickupsScreen.tsx`, `TransactionsScreen.tsx` are nearly 100% inline `style`). **This is a real inconsistency to expect, not a pattern to over-fit to** — pick one convention for the driver app rather than mirroring the split.
- `nativewind-env.d.ts` exists for TS support of `className` on RN primitives.

### TypeScript
`tsconfig.json` highlights:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "types": ["react", "react-native", "nativewind/types"]
  },
  "extends": "expo/tsconfig.base"
}
```
`strict: true` is on. TypeScript devDependency is `~6.0.3`. Path alias `@/*` → `./src/*` is configured in Babel (`module-resolver`) — note it is NOT mirrored in `tsconfig.json` `paths` (no `paths` key at all), so `@/...` imports work at runtime/Metro but every file actually observed in this repo uses **relative imports** (`../../context/ThemeContext`), not the `@` alias — the alias appears unused in practice.

### Testing
**No testing setup exists.** Confirmed by:
- No `jest` key or `jest.config.*` file anywhere in the repo.
- No `__tests__` directories anywhere under `src/`.
- No `jest`, `@testing-library/react-native`, `react-test-renderer`, or similar packages in `package.json` `dependencies`/`devDependencies`.
- `package.json` scripts are: `start`, `android`, `ios`, `web`, `lint`, `typecheck`, `prebuild:android`, `android:signing-report`, `credentials:android` — no `test` script.

Do not assume a test harness exists to copy conventions from; the driver app will need to establish its own testing setup from scratch if desired.

---

## 2. Design tokens

### Where tokens live
There is **no centralized token file** (no `src/constants/colors.ts` or similar). Colors/typography are defined/duplicated in three places:
1. `src/context/ThemeContext.tsx` — the `LIGHT`/`DARK` theme-color objects (surface/border/text roles).
2. Inline hex literals scattered across ~50+ screens/components for brand/status/semantic colors that are NOT theme-dependent (e.g. `#31973D` appears in 58 files).
3. `tailwind.config.js` — contributes nothing; `theme.extend: {}` is empty, so Tailwind's default palette is unused and every color is an arbitrary-value class (`bg-[#31973D]`) or inline `style`.

### Actual values found, verbatim

**`ThemeContext.tsx` (light/dark surface & text roles)** — full literal object, lines 20–44:
```ts
const LIGHT: ThemeColors = {
  bg: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FAFAFA',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#101828',
  textSub: '#64748A',
  textMuted: '#99A1AF',
  iconBg: '#F1F5F9',
  iconColor: '#111827',
};

const DARK: ThemeColors = {
  bg: '#0F1621',
  surface: '#141D2B',
  card: '#1A2438',
  border: '#53617C',
  borderLight: '#374258',
  text: '#F1F5F9',
  textSub: '#94A3B8',
  textMuted: '#64748A',
  iconBg: '#1E2D40',
  iconColor: '#CBD5E1',
};
```

**Brand / semantic colors (grepped across `src/`, verbatim hex, with file counts):**
- Brand green `#31973D` — used in 58 files (buttons, active tab pill, success states, Eco-Points, star-rating accents alongside `#0D631B`/`#006B23`/`#34A853`/`#38A667` variants for icons/checkmarks — there is NOT a single canonical "green," several shades of green are used for different affordances).
- Destructive red `#EF4444` — 14 files (e.g. `WalletCheckoutScreen.tsx`, `PaymentVerificationScreen.tsx`).
- Destructive icon-chip bg `#FFE2E2` — 3 files (`ScheduleFormDrawer.tsx`, `PaymentScreen.tsx`, `WalletCheckoutScreen.tsx`). Note: a *different*, more common destructive-chip bg `#FDE8E8` (with icon color `#DC2626`) is used far more often, e.g. `PaymentDrawer.tsx` line 96–98, `PickupRequestModal.tsx` (close buttons). **`#FFE2E2`/`#EF4444` and `#FDE8E8`/`#DC2626` are two distinct destructive-chip color pairs in active use — pick one for the driver app rather than assuming a single pair.**
- Gold/premium bg `#FFE088` — 8 files (`RoundedButton.tsx` premium variant, `HomeScreen.tsx`, `ChoosePlanScreen.tsx`, `ZubbaWalletScreen.tsx` Eco-Reward icon bg, etc.).
- Gold/premium text `#735C00` — confirmed (e.g. `ZubbaWalletScreen.tsx` line 73, Eco-Reward icon color). `#574500` was **not found** anywhere in `src/` — only `#735C00` is actually used as the premium/gold text color; `#574500` appears to be spec-only (not observed in code).
- Status colors — confirmed exact match, from `src/screens/wallet/TransactionsScreen.tsx` lines 36–41:
  ```ts
  const STATUS_COLOR: Record<TxStatus, string> = {
    SUCCESS: "#31973D",
    CREDITED: "#31973D",
    PENDING: "#555E59",
    FAILED: "#FF383C",
  };
  ```
  (Identical object duplicated in `src/screens/wallet/ZubbaWalletScreen.tsx` lines 45–50.)
- Rating star gold `#FEC002` — found only in `ScheduleFormDrawer.tsx`. The much more common star-icon color actually used on driver/rating cards (`PickupRequestModal.tsx`, `DriverArrivesScreen.tsx`, `DriversFoundScreen.tsx`) is **`#0D631B`** (a dark green), not gold — e.g. `DriverArrivesScreen.tsx` line 56: `<MaterialCommunityIcons name="star" size={moderateScale(14)} color="#0D631B" />`. In `RateRideScreen.tsx`'s 1–5 star selector, filled stars use `#31973D` (brand green) and unfilled use `#BECAB9`. **No screen actually renders a gold `#FEC002` star for driver ratings** — gold star color is effectively unused/inconsistent with the spec's claim.
- Medal gold `#D4AF37` — confirmed, 5 files (`ScheduleFormDrawer.tsx`, `DriversFoundScreen.tsx`, `AboutUsScreen.tsx`, `SettingsScreen.tsx`, `ZubbaWalletScreen.tsx`).
- Font: **Poppins**, confirmed via `@expo-google-fonts/poppins` dependency and `fontFamily: 'Poppins'` inline in 15+ files (e.g. `PickupsScreen.tsx`, `StatCard.tsx`). Font weights are NOT loaded/applied as separate Poppins weight variants in the files inspected — `fontWeight` is set as a normal RN string (`'500'`, `'600'`, `'bold'`) alongside `fontFamily: 'Poppins'`, which on most platforms will NOT actually render distinct Poppins weights unless the specific weighted font files (Poppins_400Regular, Poppins_600SemiBold, etc.) are loaded via `expo-font` and referenced by their specific family name — worth double-checking `App.tsx` for how fonts are actually loaded before assuming all 400–900 weights render correctly today.

### Drift vs. spec §2.5 — explicit flags

| Spec claim | Actual finding | Verdict |
|---|---|---|
| Brand green `#31973D` | Confirmed, but co-exists with `#0D631B`, `#006B23`, `#34A853`, `#38A667` as related-but-different greens used for icons/accents | **Partial drift** — spec oversimplifies to one green |
| Destructive red `#EF4444` bg `#FFE2E2` | Both values exist, but a second destructive pair `#DC2626` / `#FDE8E8` is used more frequently for icon-chip close/cancel buttons | **Drift/omission** — spec should note two destructive pairs |
| Gold/premium bg `#FFE088`, text `#574500`/`#735C00` | `#FFE088` and `#735C00` confirmed; `#574500` not found anywhere in `src/` | **Drift** — `#574500` unverified, likely spec-only or a shade never actually shipped |
| Status Success `#31973D` / Pending `#555E59` / Failed `#FF383C` | Exact match, verbatim `STATUS_COLOR` object confirmed in two files | **Match** |
| Rating star gold `#FEC002` | Found in exactly one file (`ScheduleFormDrawer.tsx`); actual driver/rating-card star color is `#0D631B` (dark green), and `RateRideScreen`'s stars use `#31973D`/`#BECAB9` | **Significant drift** — spec's claimed "gold star" is not what's rendered on the driver-rating UI the driver app must mirror |
| Medal `#D4AF37` | Confirmed | **Match** |
| Font Poppins | Confirmed, but weight-variant loading not verified (see above) | **Match with caveat** |
| Light theme `bg #FFFFFF, surface #F8FAFC, card #FFFFFF, border #E2E8F0, text #101828, textSub #64748A` | `bg/surface/border/text/textSub` all match exactly. **`card` does NOT match**: actual is `#FAFAFA`, not `#FFFFFF` | **Drift** — spec has the wrong light-mode card color |
| Dark theme `bg #0F1621, surface #141D2B, card #1A2438, border #2D3748, text #F1F5F9, textSub #94A3B8` | `bg/surface/card/text/textSub` all match exactly. **`border` does NOT match**: actual is `#53617C` (with a second dark `borderLight: #374258`), not `#2D3748` | **Drift** — likely explained by the recent commit `9f25503 fix: lighten dark mode border colors`, i.e. the spec was drafted before that fix landed. The driver app should use the **current** `#53617C`/`#374258` values, not the spec's `#2D3748`. |
| Same `ThemeContext` pattern, AsyncStorage-persisted | Confirmed, see §3 | **Match** |

**Practical takeaway for the driver app builder:** copy the live `ThemeContext.tsx` values (§3) verbatim rather than the spec's §2.5 table — the spec was written from an audit snapshot and the theme file has since changed (dark border), and several "single color" claims (green, gold star) are actually a small family of related-but-distinct hexes depending on context.

---

## 3. ThemeContext pattern

**File**: `src/context/ThemeContext.tsx` (full file, 86 lines — reproduced in relevant parts above in §2 for the color objects).

### Full hook API
```ts
export type ThemeColors = {
  bg: string;
  surface: string;
  card: string;
  border: string;
  borderLight: string;
  text: string;
  textSub: string;
  textMuted: string;
  iconBg: string;
  iconColor: string;
};

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggle: () => void;
};

export function useTheme(): ThemeContextType
```
`useTheme()` returns `{ isDark, colors, toggle }` — no `setDark(explicit)` setter, only a `toggle()` that flips the boolean. There is no "system" theme mode; it's a strict light/dark boolean with no explicit "follow OS" option (despite `app.json`'s `"userInterfaceStyle": "light"` locking the OS-level style to light regardless of in-app theme).

### Persistence — verbatim
Storage key constant: `const STORAGE_KEY = '@zubba_theme';` (line 5).

Load-on-mount (lines 61–65):
```ts
useEffect(() => {
  AsyncStorage.getItem(STORAGE_KEY).then(val => {
    if (val === "dark") setIsDark(true);
  });
}, []);
```
Note: it only checks for the literal string `"dark"` to flip to dark; any other stored value (including `"light"` or `null`) falls through to the default `useState(false)` (light). It does not persist an explicit "unset" state distinctly from light.

Save-on-toggle (lines 67–73):
```ts
const toggle = useCallback(() => {
  setIsDark(prev => {
    const next = !prev;
    AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    return next;
  });
}, []);
```

Provider composition (lines 75–81):
```ts
const value = useMemo(
  () => ({ isDark, colors: isDark ? DARK : LIGHT, toggle }),
  [isDark, toggle]
);

return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

### Verbatim usage example from a real screen
`src/screens/settings/SettingsScreen.tsx`:
```ts
const { isDark, colors, toggle } = useTheme();
...
{isDark ? "Dark mode" : "Light mode"}
...
<AnimatedSwitch value={isDark} onChange={toggle} />
```
(`AnimatedSwitch` is `src/components/ui/inputs/AnimatedSwitch.tsx`, a custom animated toggle switch — not a native `Switch`.)

Elsewhere in the same file, `colors` is read repeatedly for conditional styling, e.g. line 363–364: `backgroundColor: isDark ? colors.surface : colors.bg, borderColor: isDark ? colors.border : colors.borderLight`.

---

## 4. Reusable UI primitives

### Button component(s)
Two competing button primitives exist — **not a single canonical Button**:

1. **`src/components/Button.tsx`** — full props:
```ts
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant; // 'primary' | 'secondary' | 'ghost' — from src/types/ui.ts
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: ReactNode;
};
```
   Uses slate colors (`bg-[#0F172A]` primary, `bg-[#E2E8F0]` secondary), **not** brand green — this component appears to predate the current green branding and is not widely used in the screens surveyed.

2. **`src/components/common/RoundedButton.tsx`** (default export) — the one actually aligned with brand colors:
```ts
interface RoundedButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "premium";
}
```
   Full render logic:
   ```tsx
   <Pressable
     className={[
       "h-12 rounded-full justify-center items-center px-4",
       isPremium ? "bg-[#FFE088]" : isPrimary ? "bg-[#31973D]" : "bg-white border border-[#E2E8F0]",
     ].join(" ")}
     {...props}
   >
     <Text className={["text-[14px]", isPrimary ? "text-white" : "text-black"].join(" ")}>
       {title}
     </Text>
   </Pressable>
   ```
Most screens, however, do **neither** — they inline a `Pressable` with `className="h-12 rounded-full bg-[#31973D] ..."` or full inline `style={{...}}` directly (e.g. `AuthorizePaymentScreen.tsx` line 103–111, `PaymentVerificationScreen.tsx` line 152). **The dominant real-world convention is an inline `Pressable` styled per-screen, not a shared Button component.** Recommend the driver app establish ONE actual shared primary button and use it everywhere, rather than copying this fragmentation.

### Card component(s)
**`src/components/Card.tsx`**:
```ts
type CardProps = {
  children: ReactNode;
};
export function Card({ children }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      className="rounded-[20px] p-4 border"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}
```
Like `Button.tsx`, this generic `Card` is rarely used directly in the screens surveyed — most "card" surfaces (e.g. `TransactionsScreen.tsx`'s "Recent Activity" card) are inlined as `View` with `borderRadius: moderateScale(24)`, `borderWidth: 1`, `borderColor: colors.border`, `backgroundColor: colors.card` — note the **actual common corner radius used in real cards is `moderateScale(24)`**, not the `Card.tsx` component's hardcoded `20`.

### List row / SectionList pattern (`PickupsScreen`)
File: `src/screens/pickup/PickupsScreen.tsx`. Full pattern:
- Two-tab `TabBar` (Completed/Pending) rendered above a `SectionList`.
- `Pickup` row shape (locally typed, not shared):
  ```ts
  type Pickup = {
    id: string;
    date: string;
    status: string;
    location: string;
    amount: string;
    raw: CustomerRequestItem;
  };
  type PickupSection = { title: string | null; data: Pickup[] };
  ```
- Sections are built client-side by filtering a flat `CustomerRequestItem[]` array into `completedSections`/`pendingSections` — there is no server-driven date-grouping; `section.title` is always `null` in this screen (single ungrouped section per tab). (Note: `docs/DRIVER_APP_SPEC.md` §5.8 describes this as "grouped-by-date" — that is **not what the code currently does**; it's a single flat section per tab, not date-grouped. Flagging this as a spec inaccuracy for the driver app builder to be aware of.)
- Row rendering (`PickupRow`) shows a 40×40 circular icon (tricycle image), date+status muted text, location, bold amount, and a trailing 32×32 circular icon button (`receipt-text-outline` for completed / `refresh` for pending) — full snippet in the file at lines 132–228.
- `ListEmptyComponent`:
  ```tsx
  <View style={{ padding: moderateScale(32), alignItems: "center" }}>
    <Text style={{ fontFamily: "Poppins", fontSize: moderateScale(14), color: colors.textSub, textAlign: "center" }}>
      No pickups yet
    </Text>
  </View>
  ```
- `RefreshControl` uses `tintColor="#31973D"` / `colors={["#31973D"]}`.

### `AppBottomNav.tsx`
File: `src/components/AppBottomNav.tsx`. Props:
```ts
type Tab = 'home' | 'calendar' | 'saved' | 'settings';
type Props = {
  activeTab: Tab;
  paddingBottom?: number;
  bottomOffset?: number;
  showCalendar?: boolean;
  navigation: any;
};
```
Pill container: absolutely positioned (`position: absolute; left:0; bottom:0; right:0`), inner row is `borderRadius: 9999`, `backgroundColor: colors.card`, `borderWidth: 1`, `borderColor: colors.border`, width capped at `scale(402)` if the customer `is_premium` (reads `useAppSelector(state => state.customer.is_premium)` directly inside the nav bar) or `scale(300)` otherwise (extra width accommodates the 4th "Schedule" tab shown only for premium).

Per-tab `NavItem` — active/inactive pill:
```tsx
<Pressable
  onPress={onPress}
  className={`flex-row items-center justify-center rounded-full px-5 py-2 gap-2 ${
    active ? 'bg-[#31973D]' : 'bg-transparent'
  }`}
>
  <View className="w-6 h-6 items-center justify-center">{icon}</View>
  {active && <Text className="text-white text-xs font-normal">{label}</Text>}
</Pressable>
```
- Active tab: green (`#31973D`) filled pill, white icon, **label text only shows when active** (inactive tabs are icon-only, exactly matching spec's claim).
- Inactive icon color: `colors.textSub` (theme-dependent, not a fixed hex).
- Active icon color: hardcoded `"#fff"`.
- A `useSharedValue`/`withSpring` Reanimated scale bump (`1` → `1.08`) plays on the pressable per-tab when it becomes active.
- Navigation calls are direct: `navigation.navigate("Home")`, `navigation.navigate("Schedule")`, `navigation.navigate("Pickups")`, `navigation.navigate("Settings")` — plain string route names on the single root stack, not tab-navigator state.

### OTP / numeric-keypad pattern
**Correction to spec's cross-reference**: the spec's §5.5/§2.2 text ("mirrors OTP-style UI already used in `PaymentVerificationScreen`") is **inaccurate** — `src/screens/payments/PaymentVerificationScreen.tsx` has no keypad/OTP input at all; it is a polling/status screen (polls `GET /payments/status/:reference` every 3s and shows pending/success/failed states). The actual reusable numeric-entry patterns are:

1. **`src/components/common/OTPInput.tsx`** — the real shared OTP component, used by `VerifyOtpScreen.tsx`:
```ts
type OTPInputProps = {
  value: string[];
  onChange: (digits: string[]) => void;
  length?: number;      // default 4
  onComplete?: (otp: string) => void;
};
export function OTPInput({ value, onChange, length = 4, onComplete }: OTPInputProps)
```
   Renders `length` individual `TextInput` boxes (`moderateScale(44)` square, `keyboardType="number-pad"`), auto-advances focus forward on digit entry and backward on backspace, supports paste (multi-char `onChangeText` splits into the digit array), and calls `onComplete(joinedDigits)` once every box is filled. Box fill color: `value[i] ? colors.card : colors.surface`; border: `value[i] ? "#34A853" : colors.border`.

   Usage in `src/screens/auth/VerifyOtpScreen.tsx`:
   ```tsx
   <OTPInput value={codeDigits} onChange={setCodeDigits} length={4} onComplete={handleVerify} />
   ```

2. **`src/screens/payments/AuthorizePaymentScreen.tsx`** — a **PIN-entry** pattern (4-digit payment PIN, visually similar to OTP but functionally a local PIN, not server-verified per keystroke): renders 4 `Pressable` "boxes" reflecting `pin` string state, with a single **hidden** `TextInput` (`className="absolute opacity-0 w-1 h-1"`) capturing actual keyboard input and the boxes acting as a purely visual proxy:
   ```tsx
   const [pin, setPin] = React.useState("");
   const inputRef = React.useRef<TextInput | null>(null);
   const digits = Array.from({ length: 4 }).map((_, i) => pin[i] || "");
   ...
   <TextInput
     ref={inputRef}
     value={pin}
     onChangeText={(text) => { if (/^\d*$/.test(text) && text.length <= 4) setPin(text); }}
     keyboardType="numeric"
     maxLength={4}
     className="absolute opacity-0 w-1 h-1"
   />
   ```
   Box active/filled border color: `'#31973D'`; box background: `colors.surface`.

For the driver app's collection-code verification (spec §5.5), the **`OTPInput.tsx` component (pattern 1) is the correct one to port/reuse** — it's the actual shared, reusable, per-digit-focus-managed component; `AuthorizePaymentScreen`'s hidden-input approach is a one-off local pattern, not a shared component.

### Status pills / badges
Canonical status-color map (verbatim, appears identically in both `TransactionsScreen.tsx` lines 36–41 and `ZubbaWalletScreen.tsx` lines 45–50):
```ts
type TxStatus = "SUCCESS" | "CREDITED" | "PENDING" | "FAILED";
const STATUS_COLOR: Record<TxStatus, string> = {
  SUCCESS: "#31973D",
  CREDITED: "#31973D",
  PENDING: "#555E59",
  FAILED: "#FF383C",
};
```
Rendered as plain uppercase `Text` (not a pill/chip background) in `TransactionRow`:
```tsx
<Text style={{ fontSize: moderateScale(10), fontWeight: "600", letterSpacing: -0.5, textTransform: "uppercase", color: STATUS_COLOR[tx.status], lineHeight: moderateScale(15) }}>
  {tx.status}
</Text>
```
There is no separate filled/pill-background "status badge" component — the "Driver Ready" indicator on `DriverArrivesScreen.tsx` (line 124–127) is the closest thing to a true pill badge: a rounded (`999`) `View` with `backgroundColor: 'rgba(49,151,61,0.1)'`, a small 8×8 dot (`backgroundColor: '#2E7D32'`), and `Text` in `'#31973D'`.

### Empty-state component(s)
**No shared/reusable `EmptyState` component exists.** Each screen inlines its own, with two recurring styles:
1. Minimal text-only (e.g. `PickupsScreen.tsx`, `TransactionsScreen.tsx`): centered `Text`, `colors.textSub`, `moderateScale(14)`, inside `padding: moderateScale(32)`.
2. Illustrated (e.g. `ScheduleScreen.tsx` lines 341–350): a bordered container (`h-[360px]`, `rounded-[20px]`) with a custom SVG-like illustration component (`ScheduleIllustration` from `src/components/schedule/ScheduleIllustration.tsx`) plus heading/subtext, shown when `showEmpty = !isSchedulesLoading && visibleSchedules.length === 0`.

Recommend the driver app define one shared `EmptyState` component (icon/illustration slot + title + optional subtext) rather than perpetuating the copy-paste pattern.

### Modals / bottom sheets
No wrapper/library for bottom sheets (no `@gorhom/bottom-sheet` in `package.json`) — all "sheets" are hand-built with RN's core `Modal`:
- **`src/components/payment/PaymentDrawer.tsx`** (`PaymentMethodDrawer`) — canonical bottom-sheet pattern: `<Modal transparent animationType="slide" statusBarTranslucent>`, backdrop `Pressable` (`className="flex-1 bg-black/40 justify-end"`) that closes on tap-outside, sheet `Pressable` with `e.stopPropagation()`, `borderRadius` only on top corners (`rounded-t-[32px]`), a drag-handle bar (`h-0.5 rounded-full`, 30% width capped at `scale(200)`), safe-area-aware bottom padding via `useSafeAreaInsets()`.
- **`src/components/ui/modals/PickupRequestModal.tsx`** — a state-machine modal keyed by a `step` prop (`"" | "found_drivers" | "customer_requests" | "driver_accepts" | "on_the_way"`), each step rendering different content in the same sheet shell; the `"on_the_way"` step renders **without** the `Modal` wrapper at all (`isCompact` shortcut returns raw `content`, used as an inline overlay rather than a true modal) — worth noting as a subtlety if porting this pattern.
- Filter/menu popovers (e.g. `TransactionsScreen.tsx`'s filter dropdown) use `<Modal transparent animationType="fade">` anchored via `measureInWindow` to position a small dropdown card near the triggering button, rather than a true sheet.

### Payment-rail badges (MTN MoMo / Telecel Cash / Airtel Money)
Confirmed verbatim in `src/screens/payments/SavedCardsScreen.tsx` (lines 61–90) and duplicated with near-identical values in `src/screens/payments/PremiumPaymentScreen.tsx` (lines 79–125):
- **MTN**: `84×78`(ish) rounded rect, `backgroundColor: '#FFCC00'`, black text `MTN` / `MTN MoMo`, `fontFamily: 'Poppins', fontWeight: '600'`.
- **Telecel**: same size, `backgroundColor: '#DC2626'`, white bold text `"Telecel\nCash"` / label `Telecel Cash`.
- **Airtel**: white/`colors.surface` background with a `1px colors.border` border (no brand-red fill — uses the app's neutral surface, not a distinct Airtel color), red lowercase "t" wordmark glyph (`color: '#EF4444', fontWeight: '700'`) — text is literally a lowercase `t` character standing in for the Airtel logo, label `Airtel money`.
- Selected-state ring color across all three: `'#31973D'` border.
- These exact three colors/labels are what the spec's §5.6 payout-method badges should reuse for the driver app's payout-rail selection UI.

---

## 5. Navigation structure

**Files**: `src/navigation/RootNavigator.tsx`, `src/navigation/types.ts`. That's the entire navigation layer — **only two files, no nested navigators, no tab navigator package.**

### Key structural fact
There is exactly **one `createNativeStackNavigator<RootStackParamList>()`** (`RootNavigator.tsx` line 69), and every one of the ~65 screens in `src/screens/**` is registered as a flat `<Stack.Screen name="..." component={...} />` inside it (lines 102–159). `initialRouteName="Splash"`.

Route-name convention: PascalCase, matching the screen's purpose not its file path (e.g. `"DriverArrives"` for `DriverArrivesScreen.tsx`, `"ZubbaWallet"` for `ZubbaWalletScreen.tsx`). Route params are typed centrally in `src/navigation/types.ts`'s `RootStackParamList`, e.g.:
```ts
DriversFound: {
  drivers: Array<NearbyDriver>;
  pickupLocation?: { latitude: number; longitude: number };
  pickupAddress?: string;
};
LiveTracking: { requestId: string };
```
and consumed per-screen via the generic:
```ts
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
```
e.g. `export function PickupsScreen({ navigation }: RootStackScreenProps<"Pickups">)`.

### "Bottom tabs" are simulated, not a real tab navigator
Since there's no tab navigator, `AppBottomNav.tsx` (§4) is rendered manually inside each top-level screen (`HomeScreen`, `PickupsScreen`, `SettingsScreen`, `ScanningScreen`, etc.) as an absolutely-positioned overlay, and tapping a nav item just calls plain `navigation.navigate("Home" | "Schedule" | "Pickups" | "Settings")` on the single shared stack — there is no isolated per-tab navigation stack/history. **This means "switching tabs" and "drilling into a detail screen" both go through the exact same stack mechanism** — there's no nested-stack-within-tab pattern to replicate structurally, just: render `<AppBottomNav activeTab="..." navigation={navigation} />` at the bottom of every screen that should show the nav bar, and pass it whatever the local `navigation` prop is.

### Concrete drill-in example: Pickups tab → detail screen
From `src/screens/pickup/PickupsScreen.tsx` (`handlePickupPress`, lines 323–351): tapping a pickup row on the "Pickups" tab dispatches the tapped item into Redux (`dispatch(setRequest(buildRequestStateFromItem(raw)))`) **before** navigating, so the destination screen reads shared request state from the `request` slice rather than receiving it as a route param:
```ts
if (activeTab === "pending") {
  if (raw.status === "arrived") {
    dispatch(setRequest(buildRequestStateFromItem(raw)));
    navigation.navigate("DriverArrives");
    return;
  }
  if (["pending", "accepted", "en_route", "paid"].includes(raw.status)) {
    dispatch(setRequest(buildRequestStateFromItem(raw)));
    navigation.navigate("LiveTracking", { requestId: raw.id });
    return;
  }
}
if (activeTab === "completed" && raw.status === "completed") {
  dispatch(setRequest(buildRequestStateFromItem(raw)));
  const payment = getPaymentDetailsFromRequest(raw);
  navigation.navigate("PaymentSuccess", { phone: payment.phone, amount: payment.amount, provider: payment.provider, reference: payment.reference, paymentMethodLabel: payment.paymentMethodLabel });
  return;
}
```
This **Redux-slice-as-navigation-payload** pattern (dispatch shared state, then `navigate` with only lightweight params like an id) is the dominant convention throughout the app (also used for `ScanningScreen` → `DriverArrivesScreen`, etc.) and should likely be mirrored for the driver app's Jobs tab → job-detail screen flow.

---

## 6. Redux slice conventions

**Folder**: `src/slices/` — organized as one subfolder per domain (`auth/`, `customer/`, `request/`) plus a flat top-level `appSlice.ts`. Convention per domain folder: `<domain>.types.ts` (interfaces) + `<domain>Slice.ts` (the `createSlice` call) + occasionally extra files (`auth/auth.hooks.ts` for React Query mutation wrappers, `auth/hydrateAuth.ts` for session bootstrap). **Note**: `src/slices/request/request.types.ts` exists but its `RequestState`/`DriverRequest` interfaces are NOT actually imported by `requestSlice.ts` — the slice defines its own local, more complete `RequestState`/`DriverRequest` interfaces inline. `request.types.ts` looks like a stale/superseded file; don't assume every `<domain>.types.ts` file is the live source of truth — check each slice file directly.

Root store (`src/store/index.ts`) registers exactly 4 reducers: `app`, `auth`, `customer`, `request`. `serializableCheck: false` is set globally (because `request.date_created`/`payment_date` store raw `Date` objects in state). No `redux-persist` wiring at the store level despite the dependency being installed — auth persistence is manual (`src/utils/authStorage.ts`).

### Representative slice anatomy — `customerSlice.ts` (full file)
```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "./customer.types";

const initialState: Customer = {
    id: "",
    points: 0,
    bags_recycled: 0,
    is_premium: false,
    profile_picture: null,
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<Customer>) => {
            state.id = action.payload.id;
            state.points = action.payload.points;
            state.bags_recycled = action.payload.bags_recycled;
            state.is_premium = action.payload.is_premium;
            state.profile_picture = action.payload.profile_picture ?? null;
        },
        updateProfilePicture: (state, action: PayloadAction<string | null>) => {
            state.profile_picture = action.payload;
        },
        clearCustomer: () => initialState,
        upgradeToPremium: (state) => { state.is_premium = true; },
        cancelPremium: (state) => { state.is_premium = false; },
    }
})

export const { setCustomer, clearCustomer, upgradeToPremium, cancelPremium, updateProfilePicture } = customerSlice.actions
export const customerReducer = customerSlice.reducer
```
with `Customer` (`customer.types.ts`, full file):
```ts
export interface Customer {
    id: string;
    points: number;
    bags_recycled: number;
    is_premium: boolean;
    profile_picture?: string | null;
}
```
No async thunks anywhere in the Redux slices — all server calls go through plain axios `api.*Service` functions (or React Query `useMutation`, see `auth.hooks.ts`) and dispatch plain sync actions with the resolved data, e.g. `RootNavigator.tsx`:
```ts
const customerResponse = await customerService.getCustomerById(user.id);
if (customerResponse.success) {
  dispatch(setCustomer(customerResponse.data.customer));
}
```

### `authSlice.ts` — precise anatomy (full file, 57 lines)
```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string; }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) { state.user = { ...state.user, ...action.payload }; }
    },
    logout: () => initialState,
  },
});

export const { setCredentials, updateAccessToken, updateUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

**`User` type — exact, from `src/slices/auth/auth.types.ts`:**
```ts
export type AuthKey = "email" | "phone";
export type UserRole = "customer" | "driver";
export type OtpPurpose = "login" | "password_reset" | "email_verification" | "payment" | "update_old" | "update_new";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstname: string;
  lastname: string;
  role: "customer" | "driver" | "admin";
  is_active: boolean;
  verified: boolean;
  terms_accepted_at?: string | null;
  profile_picture?: string | null;
}
```

**Important precision note (confirms spec §2.1 but adds nuance the spec omits)**: `User.role` is a 3-way union (`"customer" | "driver" | "admin"`), but the separate, adjacent `UserRole` type (used for the registration DTO below) is only a **2-way** union: `"customer" | "driver"` — **`"admin"` is deliberately excluded from `UserRole`**, i.e. you cannot self-register as admin via the DTO even though a `User` record can carry that role server-side. This is exactly the shape the driver app's registration call should reuse: pass `role: "driver"` typed as `UserRole`, not as `User["role"]`.

**Registration DTO — exact shape, `src/slices/auth/auth.types.ts`:**
```ts
export interface RegisterDto {
  authKey: AuthKey;      // "email" | "phone"
  authValue: string;
  role: UserRole;        // "customer" | "driver"
  find?: boolean
}
```
Real call-site usage, `src/screens/auth/SignUpScreen.tsx`:
```ts
const registerMutation = useRegister(); // from src/slices/auth/auth.hooks.ts, wraps authService.register
...
const res = await registerMutation.mutateAsync({
  authKey: "phone",
  authValue: phoneNumber,
  role: "customer",
});
```
For the driver app, the equivalent call is identical except `role: "driver"`.

Companion DTOs (same file):
```ts
export interface VerifyOtpDto { authKey: AuthKey; authValue: string; otp: string; purpose: OtpPurpose; }
export interface ResendOtpDto { authKey: AuthKey; authValue: string; purpose: OtpPurpose; }
export interface RefreshTokenDto { refreshToken: string; }
export interface AuthTokens { accessToken: string; refreshToken: string; }
```

Endpoints actually called (`src/api/authService.ts`), confirming spec §2.1's endpoint list exactly: `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/resend-otp`, `POST /auth/refresh-token`, plus one not mentioned in the spec: `GET /auth/welcome-context` (returns `isFirstLogin`/`previousLogin`/`matchesCurrentLogin`, used to route to `ExistingUserNotification` vs onboarding after OTP verify), and `POST /auth/google` (Google sign-in, hardcodes `role: "customer"` — **this hardcoding will need a driver-app-side equivalent or a role param added if Google sign-in is wanted for drivers**).

---

## 7. Mock-data conventions

**No dedicated "mocks" folder or files exist anywhere in the repo** (`grep -rli mock src` returns only one file: `src/screens/wallet/ZubbaWalletScreen.tsx`, which contains an inline hardcoded array, not an external mock file). Mock/hardcoded data is a very localized, inline pattern:

**`src/screens/wallet/ZubbaWalletScreen.tsx`** (lines 31–86) — the one clear example, worth copying the *shape* from:
```ts
type TxStatus = "SUCCESS" | "CREDITED" | "PENDING" | "FAILED";

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
  status: TxStatus;
  iconBg: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
};

const STATUS_COLOR: Record<TxStatus, string> = { SUCCESS: "#31973D", CREDITED: "#31973D", PENDING: "#555E59", FAILED: "#FF383C" };

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", title: "Weekly Pickup Fee", date: "Oct 24, 2023 • 08:45 AM", amount: "- GHS 45.00", amountColor: "#FF383C", status: "SUCCESS", iconBg: "rgba(0, 107, 35, 0.1)", iconName: "receipt-text-outline", iconColor: "#31973D" },
  { id: "2", title: "Eco-Reward", date: "Oct 22, 2023 • 02:15 PM", amount: "+ 250 pts", amountColor: "#31973D", status: "CREDITED", iconBg: "#FFE088", iconName: "leaf", iconColor: "#735C00" },
  { id: "3", title: "MoMo Top-up", date: "Oct 20, 2023 • 11:30 AM", amount: "+ GHS 200.00", amountColor: "#31973D", status: "PENDING", iconBg: "rgba(20, 135, 50, 0.1)", iconName: "cellphone", iconColor: "#31973D" },
];
```
Naming pattern: `MOCK_<PLURAL_NOUN>` constant, `UPPER_SNAKE_CASE`, module-scoped (not exported), typed against a **locally-declared** `Transaction` type that is NOT shared with/imported from any API-response type file — i.e. mock/UI-local types and real API-response types (`src/types/*.types.ts`) are **not unified**; each screen that needs mock/display data re-declares its own display-shape type inline (compare `TransactionsScreen.tsx`'s near-identical-but-separately-declared `Transaction` type, which maps from `walletService.getTransactions()`'s real response via a local `mapTransaction()` function rather than sharing the mock's type).

**Important correction to the spec's core premise**: `docs/DRIVER_APP_SPEC.md` §1/§2.2 states the pickup-matching flow ("Marcus Chen", rating 4.9, `ZB-Expert` code, GHS 20.00 mock driver) is "simulated with hardcoded mock data" in `ScanningScreen`/`DriversFoundScreen`/`DriverArrivesScreen`. **This is no longer accurate as of the current code** — a targeted search for `"Marcus Chen"`, `"ZB-Expert"`, and the literal collection code `"8249"` returns **zero matches** anywhere in `src/`. Instead:
- `src/screens/pickup/ScanningScreen.tsx` calls a real endpoint: `driverService.getNearbyDrivers({ lat, lng, isPremium })` → `GET /drivers/nearby` (`src/api/driverService.ts`), returning typed `NearbyDriver[]` (`src/types/driver.types.ts`):
  ```ts
  export interface NearbyDriver {
    id: string; name: string; code: string | null; profilePicture: string | null;
    rating: number; isPremium: boolean; ratingCount: number; distanceM: number;
    etaMinutes: number; cost: number; latitude?: number; longitude?: number;
  }
  ```
- Request creation/acceptance also hits real endpoints: `customerService.requestTakeout(...)` and `requestService.updateRequestStatus(id, status)` → `PATCH customers/requests/:id/status` with status literals `"pending" | "paid" | "accepted" | "en_route" | "arrived" | "completed" | "cancelled"` (`src/api/requestService.ts`).
- The one place data is still client-fabricated is the **bag count at request-creation time**: `ScanningScreen.tsx`'s `customer_requests()` hardcodes `bags: 1` when building the `RequestTakeout` payload sent to the backend (not "Bin bags: 2" as the spec states verbatim — the current hardcode is `1`, and it's set at pickup-request time, not receipt-display time). The receipt screen (`PaymentSuccessScreen.tsx` line 40) just echoes back whatever `request.bags` holds: `` `${request.bags || 0} Bag${request.bags !== 1 ? "s" : ""}` `` — it does not itself hardcode a number.

**Practical implication for the driver-app builder**: the backend already has (at least) a working `/drivers/nearby` endpoint and a request-status PATCH endpoint returning/consuming real driver identity fields (`name`, `code`, `rating`, `profilePicture`, `distanceM`, `etaMinutes`, `cost`) — this is a materially different (more advanced) starting point than the spec's framing of "everything is mocked," and the driver app's job-acceptance flow should be built to satisfy this **already-live** shape rather than assuming the backend needs these fields invented from scratch.

---

## 8. Responsive/scaling utilities

**File**: `src/utils/scale.ts` (full file, 48 lines) — this is the one real, consistently-used scaling utility in the codebase. **No `useResponsive` hook exists anywhere** (confirmed via grep — the only `useWindowDimensions` usage in the whole repo is a single ad-hoc call in `src/screens/onboarding/SplashScreen.tsx` for one logo-size calculation, not a reusable hook).

Exact implementation:
```ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

// Standard ~5" phone baseline (same default react-native-size-matters ships with).
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const MIN_RATIO = 0.85;
const MAX_RATIO = 1.15;

function clampRatio(ratio: number) {
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));
}

const widthRatio = clampRatio(shortDimension / guidelineBaseWidth);
const heightRatio = clampRatio(longDimension / guidelineBaseHeight);

export function scale(size: number) {
  return widthRatio * size;
}

export function verticalScale(size: number) {
  return heightRatio * size;
}

export function moderateScale(size: number, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export function moderateVerticalScale(size: number, factor = 0.5) {
  return size + (verticalScale(size) - size) * factor;
}

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
```
Key implementation detail worth preserving in the driver app: this is a **custom reimplementation of `react-native-size-matters`'s algorithm** (same `350×680` baseline it ships with by default) but with the width/height ratios **clamped to `[0.85, 1.15]`** before use — the in-file comment explains why: `react-native-size-matters` scales unbounded, so on large phones/phablets the ratio can exceed ~1.2x and cause independently-scaled sibling elements (e.g. a badge vs. its anchor) to drift apart and visually overlap; clamping keeps `scale`/`verticalScale`/`moderateScale` outputs close enough together across device sizes to avoid that. **`react-native-size-matters` is still a listed dependency (`^0.4.2`) but is NOT what's actually imported/used** — every file observed imports from the local `../utils/scale` (or `../../utils/scale` etc.), not from the npm package. Don't port the npm package for the driver app; port this file.

Verbatim application example, `src/components/AppBottomNav.tsx`:
```ts
import { scale, verticalScale, moderateScale } from '../utils/scale';
...
style={{
  width: '100%',
  maxWidth: isPremium ? scale(402) : scale(300),
  paddingVertical: verticalScale(12),
  paddingHorizontal: scale(16),
  ...
}}
...
<MaterialCommunityIcons size={moderateScale(20)} name="home" color="#fff" />
```
This `scale`/`verticalScale`/`moderateScale` triad (imported directly, not through a hook) is used in essentially every screen file surveyed for this audit (30+ files) for font sizes, paddings, icon sizes, and border radii — it is the single most consistent convention in the entire codebase and should be ported as-is to the driver app rather than reinvented.

---

## Summary of cross-cutting risks for the driver-app builder

1. **Styling is inconsistent (NativeWind vs. inline `style`)** — don't assume one convention; the driver app should pick one deliberately rather than mirror the split.
2. **Two Button components exist and neither is universally used** — establish a single canonical primary button early.
3. **The spec's premise that driver-matching is "hardcoded mock data" is stale** — real `/drivers/nearby` and request-status endpoints already exist and are called from `ScanningScreen`/`DriversFoundScreen`. Build against that live shape.
4. **Dark-mode border color in the spec (`#2D3748`) is outdated** — current shipped value is `#53617C` (per commit `9f25503`). Use `ThemeContext.tsx`'s live values, not the spec table.
5. **The spec's OTP-pattern cross-reference is wrong** — port `src/components/common/OTPInput.tsx`, not `PaymentVerificationScreen.tsx` (which has no keypad).
6. **`UserRole` (registration) and `User["role"]` (full user) are different unions** — `"admin"` is valid on `User` but intentionally excluded from the registration DTO's `UserRole`.
