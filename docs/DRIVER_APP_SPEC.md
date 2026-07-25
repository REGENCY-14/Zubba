# Zubba Driver App — Requirements & Specification

Status: Draft v1
Companion to: Zubba Customer App (this repo)
Author context: derived from a full audit of the existing customer app's screens, navigation, Redux state, and mock data conventions, as of 2026-07-19.

## 1. Purpose & Scope

The Zubba customer app lets a customer request an on-demand or scheduled waste pickup, get matched with a driver, pay for the pickup, and earn Eco-Points for recycled mass. Today, everything on the "driver side" of that transaction — accepting jobs, navigating to the customer, confirming pickup, logging recycled weight — is **simulated with hardcoded mock data** inside the customer app (`ScanningScreen`, `DriversFoundScreen`, `DriverArrivesScreen`). No driver-facing app, screen, Redux slice, or service exists yet.

This document specifies a standalone **Driver App** that powers the other side of every flow the customer app already assumes exists. The two apps share a backend and must agree on the same data contracts (user roles, job/pickup model, collection-code handshake, points/mass calculation).

Non-goals for v1: driver-to-driver features, multi-stop batching/route optimization, admin/dispatch console (may follow later as a 3rd surface).

## 2. Grounding: What the Customer App Already Assumes

This section is the "contract" the driver app must fulfill. Everything below is observed, not invented — it's what the customer app already displays or hardcodes, and the driver app must make real.

### 2.1 Auth already supports a driver role
`src/slices/auth/authSlice.ts` types `User.role` as `"customer" | "driver" | "admin"`, and registration DTOs type `UserRole` the same way. **The driver app should reuse the same auth/OTP endpoints** (`/auth/register`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/refresh-token`) with `role: "driver"` — no new auth backend is required, only a driver-specific onboarding/KYC flow in front of it (see §5.1).

### 2.2 The pickup lifecycle, as seen from the customer's side
1. Customer taps **Request now** on Home → `ScanningScreen` (radar animation, ~3s).
2. **Matching**: non-premium customers get a single auto-assigned driver in a bottom sheet (mock: "Marcus Chen", rating 4.9, code `ZB-Expert`, GHS 20.00); premium customers get `DriversFoundScreen`, a carousel of 3 nearby drivers to choose from (each with `name`, `initials`, `rating`, `code` in `ZB-####` format, `distanceKm`, `etaMinutes`, `premium` badge).
3. **`DriverArrivesScreen`**: shows the matched driver's card (avatar, name, rating, code, Call/Message buttons) and a **4-digit collection code** (e.g. `8249`) with the copy "Show this to Marcus to verify." This code is the handshake artifact — **the driver app must let the driver input/verify this code to confirm pickup completion.** A "Driver Ready" status pill and "Confirm Collection" row exist on the customer side.
4. Customer proceeds to payment (wallet, MTN MoMo, Telecel Cash, Airtel Money, or card) → OTP verification → PIN authorization → success receipt. The receipt hardcodes **"Bin bags: 2"** — in a real system, this must come from the driver logging actual bag count/weight at the pickup.
5. Customer rates the pickup (`RateRideScreen`: Service experience 1–5 stars, Professionalism 1–5, Eco-friendly 1–5, free-text note) → `ThankYouScreen`.

### 2.3 Eco-Points / mass_recycled economics
`customerSlice` tracks `points` and `mass_recycled` (rendered as "bags recycled this month"). `WalletCheckoutScreen` shows the actual formula: **Base Points × Premium Multiplier (x2 for Gold) = Total Reward**. Nothing currently writes real values into this state — **the driver app logging a completed pickup's bag/weight count is what should trigger this calculation server-side.**

### 2.4 Scheduling
Premium customers can schedule pickups (`ScheduleScreen`, frequency One-time/Daily/Weekly/Monthly) and optionally pin a **preferred driver** from a list (each with name + rating). The driver app needs a way for a driver to see upcoming *scheduled* jobs assigned to or requested from them, distinct from on-demand jobs.

### 2.5 Branding/theming (must match exactly, for visual consistency across both apps)
- Brand green: **`#31973D`** (primary actions, active states, success, Eco-Points)
- Destructive red: **`#EF4444`** (bg `#FFE2E2` for icon chips)
- Gold/premium accent: **`#FFE088`** bg, `#574500`/`#735C00` text
- Status colors: Success/Credited `#31973D`, Pending `#555E59`, Failed `#FF383C`
- Rating star gold: `#FEC002` / medal `#D4AF37`
- Font: **Poppins** (inline `fontFamily: 'Poppins'`, weights 400–900 by emphasis)
- Light theme: `bg #FFFFFF`, `surface #F8FAFC`, `card #FFFFFF`, `border #E2E8F0`, `text #101828`, `textSub #64748A`
- Dark theme: `bg #0F1621`, `surface #141D2B`, `card #1A2438`, `border #2D3748`, `text #F1F5F9`, `textSub #94A3B8`
- Same `ThemeContext` pattern (light/dark, AsyncStorage-persisted) should be reused, not react-navigation theming.

## 3. Personas & Roles

| Role | Description |
|---|---|
| **Driver (standard)** | Independent collector who goes online, accepts on-demand jobs within range, completes pickups, gets paid out. |
| **Driver (Zubba-Expert / premium-eligible)** | Higher-rated/verified driver who appears in premium customers' `DriversFound` carousel with a badge (mirrors the `code: "ZB-Expert"` / `premium` flag already in customer-side mock data) — may get priority job routing and higher pay tier. |
| **Dispatcher/Admin** (out of scope for v1, `role: "admin"` already reserved in the type system) | Oversees driver approval, disputes, payouts — future console. |

## 4. Information Architecture (Bottom Navigation)

Mirroring `AppBottomNav.tsx`'s pill-style nav (active tab = green `#31973D` pill, inactive = icon-only in `textSub`):

1. **Home** — map-centric dashboard: online/offline toggle, incoming job requests, today's earnings summary.
2. **Jobs** — mirrors the customer's "Pickups" tab: tabbed **Active / Upcoming (scheduled) / History**, same visual pattern as `PickupsScreen`'s Completed/Pending `SectionList`.
3. **Earnings/Wallet** — new tab with no customer-side equivalent (customer's wallet is for *paying*; driver's wallet is for *getting paid*) — balance, payout history, withdraw-to-bank/mobile-money.
4. **Settings** — profile, vehicle info, documents/KYC status, support, appearance (light/dark), notifications — same structure as customer `SettingsScreen`.

No calendar tab distinction by premium tier on the driver side — instead, "Upcoming" is a sub-tab within Jobs, since all drivers should be able to see their scheduled assignments.

## 5. Functional Requirements

### 5.1 Onboarding & KYC
- Reuse existing `SignUp/EmailSignUp/SignIn/Verify` OTP screens' patterns, with `role: "driver"`.
- New driver-only KYC step (parallel to customer `KycCollectionScreen`) collecting: full name, phone, Ghana Card / national ID, driver's license, vehicle type (truck/tricycle/motorbike), vehicle registration/plate, vehicle photo, profile photo.
- Application status screen: `Pending Review → Approved → Rejected (with reason)`. Drivers cannot go online until `Approved`.
- Terms acceptance (reuse `TermsAcceptanceScreen` pattern) with driver-specific terms (liability, code of conduct, payout terms).

### 5.2 Availability
- **Online/Offline toggle** on Home — while online, driver is eligible to receive job requests within a configurable service radius; while offline, receives none.
- Background location updates while online (needed for `distanceKm`/`etaMinutes` fields already consumed by the customer app's `DriversFound` carousel).

### 5.3 Job matching & requests
- **Incoming request card** (full-screen or prominent modal, time-boxed ~15–30s countdown to respond) showing: customer's approximate location/distance, waste type/notes if provided, estimated payout, Accept / Decline actions. This is the driver-side mirror of what happens after the customer's `ScanningScreen`/`DriversFound` selection.
- For premium-customer flows where the *customer* picks from a carousel (`DriversFoundScreen`): the driver app must expose the driver as *discoverable* (profile card with `name`, `initials`/photo, `rating`, `code` in `ZB-####` format, `distanceKm`, `etaMinutes`, premium/expert badge) rather than push a blind accept/decline — i.e., two matching modes to support:
  1. **Broadcast/auto-assign** (non-premium customer path) — first driver to accept wins.
  2. **Customer-selects** (premium customer path) — driver appears in a shortlist; customer's tap effectively "requests" that specific driver, who then still confirms via Accept/Decline.
- **Scheduled job requests** (from `ScheduleScreen`/pinned "preferred driver"): appear in the Jobs → Upcoming tab, with Accept/Decline before the scheduled date, and a reminder notification as the slot approaches.

### 5.4 Navigation to pickup
- In-app map view with route/ETA to customer's location (reuse the map-background visual language from `ScanningScreen`).
- Call / Message the customer (mirrors the Call/Message buttons already present, non-functional, on the customer's `DriverArrivesScreen`).
- "Arrived" action that flips status to notify the customer (customer app already renders a "Driver Ready" pill awaiting this signal).

### 5.5 Pickup confirmation (collection-code handshake)
- **4-digit collection code entry**: the customer app displays this code and tells the customer to show it to the driver. The driver app must provide a numeric-keypad input to **verify this code against the backend** before the pickup can be marked complete — this is the single most important cross-app data contract (mirrors OTP-style UI already used in `PaymentVerificationScreen`).
- **Log recycled materials**: bag count and/or weight (kg), optionally waste category/photo — this is the real data source for what the customer app currently hardcodes as "Bin bags: 2" and what should drive the customer's `mass_recycled` stat and Eco-Points calculation (Base Points × Premium Multiplier, per §2.3).
- Mark job **Complete** → triggers customer-side payment flow and driver payout accrual.

### 5.6 Earnings & payout
- **Earnings dashboard**: today/week/month totals, per-job breakdown (date, customer initials, bags/weight, fare, tip if applicable), same status-color conventions as customer `TransactionsScreen` (`SUCCESS #31973D`, `PENDING #555E59`, `FAILED #FF383C`).
- **Payout methods**: MTN MoMo, Telecel Cash, Airtel Money, bank transfer — same payment-rail badges/colors already defined in the customer app (MTN `#FFCC00` black, Telecel `#DC2626` white "T.cash", Airtel white/red "at" wordmark) for visual consistency.
- **Withdraw to mobile money/bank** flow, mirroring customer `WithdrawScreen` UI pattern (amount entry, confirm, success toast) but pulling from *earned* balance, not a prepaid wallet.
- Payout schedule setting (instant/daily/weekly cash-out) — instant may carry a fee, flagged clearly.

### 5.7 Ratings & performance
- View own rating (aggregate of the customer-submitted Service/Professionalism/Eco-friendly scores from `RateRideScreen`) and recent per-job feedback/notes.
- Acceptance rate / completion rate / on-time rate surfaced for the driver's own visibility (transparency, not gamification in v1).
- "Zubba Expert" badge/tier: crossing a rating+volume threshold grants the `premium`/`ZB-Expert` flag already consumed by the customer's `DriversFound` carousel — this should be a documented, driver-visible progression, not a hidden flag.

### 5.8 Job history
- **Completed** and **Cancelled/Missed** tabs (mirrors customer `PickupsScreen`'s Completed/Pending `SectionList` grouped-by-date pattern), each row: customer initials/name, date, location, bags/weight, fare earned, status.

### 5.9 Notifications & support
- Push notifications for: new job request, job cancelled by customer, payout completed, KYC status change, scheduled-job reminders.
- Support/Help Center screen mirroring customer's `HelpCenterScreen`/`AboutUs`/`TermsAndConditions` structure, plus driver-specific FAQs (payout timing, dispute process, vehicle requirements).
- In-app issue reporting for a specific job (mirrors customer's "Report an Issue" button on `DriverArrivesScreen`).

### 5.10 Settings & profile
- Vehicle info management (type, plate, photo).
- Document re-upload if KYC documents expire/are rejected.
- Appearance (light/dark theme toggle, same `ThemeContext` mechanism).
- Notification preferences.
- Account/legal (Terms, Privacy, About, Logout).

## 6. Non-Functional Requirements

- **Design consistency**: reuse the exact color tokens, `Poppins` font, and light/dark `ThemeContext` pattern from the customer app (§2.5) — the two apps should feel like one product family.
- **Shared backend contracts**: reuse existing auth/OTP/user endpoints; extend (not replace) the payment service (`paymentService`) for payout rails; new endpoints needed for job matching, collection-code verification, and earnings.
- **Real-time requirements**: job broadcast/accept-race, live location updates, and status push (arrived/ready/complete) all need a realtime channel (websocket or push notifications) — none of this exists in the customer app today since everything there is a client-side mock/timeout.
- **Offline resilience**: driver app must tolerate intermittent connectivity mid-job (e.g., queue an "arrived" or "complete" action and retry) since drivers are mobile and may be in low-signal areas.
- **Location & background permissions**: needs foreground+background location while online, distinct from the customer app's more limited one-time location use.
- **Data model additions needed** (none of these exist yet — no `driver` Redux slice, no job/pickup entity in the codebase):
  - `Driver` profile: id, name, phone, rating, ratingCount, code (`ZB-####`), tier/badge, vehicle info, KYC status, availability status.
  - `Job`/`Pickup`: id, customerId, driverId, status (`requested → accepted → en_route → arrived → collecting → completed / cancelled`), location, scheduledFor (nullable), collectionCode, bagsCount/weightKg, fare, tip, createdAt/completedAt timestamps.
  - `Payout`: id, driverId, amount, method, status, requestedAt/settledAt.

## 7. Explicitly Out of Scope for v1

- Multi-stop route batching / bulk pickups.
- Driver-to-driver chat or handoff.
- Admin/dispatch console (role already reserved, not built).
- In-app navigation/turn-by-turn (link out to Google/Apple Maps is acceptable for v1).
- Automated fraud/dispute resolution (manual support flow only).

## 8. Open Questions (need product decisions before build)

1. Is a driver an independent contractor per-job, or salaried/shift-based? Affects earnings/payout model shape.
2. Does "Zubba Expert" tier need a formal application/vetting step, or is it purely rating+volume-driven?
3. For customer-selects matching (`DriversFound`), what happens if the selected driver declines — does it silently fall back to broadcast, or notify the customer to pick again?
4. Should scheduled/recurring jobs auto-accept for a driver who previously accepted the same recurring series, or require per-occurrence confirmation?
5. Tipping — does the current customer payment flow have room for it (not observed in the audit), and if not, is it a v1 requirement for the driver app's earnings model?
