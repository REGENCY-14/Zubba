import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

import { customerService } from "../api/customerService";
import { authService } from "../api/authService";
import { userService } from "../api/userService";
import { authStorage } from "./authStorage";
import { store } from "../store";
import { setCredentials, logout } from "../slices/auth/authSlice";
import { setCustomer } from "../slices/customer/customerSlice";
import type { User } from "../slices/auth/auth.types";

export type InitialRoute =
  | "Home"
  | "SignUp"
  | "NewUserOnboarding"
  | "TermsAcceptance"
  | "OnboardLocationAccess"
  | "OnboardNotificationsAccess";

export type InitialRouteParams = Record<string, unknown>;

function isProfileComplete(user: User) {
  return Boolean(user.email && user.phone && user.firstname && user.lastname);
}

function routeAfterAuth(user: User): InitialRoute {
  if (!user.terms_accepted_at) return "TermsAcceptance";
  if (!isProfileComplete(user)) return "NewUserOnboarding";
  return "Home";
}

async function restoreAuthenticatedUser(stored: NonNullable<Awaited<ReturnType<typeof authStorage.get>>>) {
  store.dispatch(
    setCredentials({
      user: { id: stored.userId } as User,
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
    }),
  );

  let accessToken = stored.accessToken;

  try {
    const me = await userService.getMe();
    if (me.success) {
      store.dispatch(
        setCredentials({
          user: me.data.user,
          accessToken,
          refreshToken: stored.refreshToken,
        }),
      );

      const customerRes = await customerService.getCustomerById(me.data.user.id);
      if (customerRes.success) {
        store.dispatch(setCustomer(customerRes.data.customer));
      }

      return routeAfterAuth(me.data.user);
    }
  } catch {
    try {
      const refreshed = await authService.refreshToken({ refreshToken: stored.refreshToken });
      accessToken = refreshed.data.accessToken;
      const me = await userService.getMe();
      if (me.success) {
        await authStorage.save({
          userId: me.data.user.id,
          accessToken,
          refreshToken: stored.refreshToken,
          lastAuthenticatedAt: stored.lastAuthenticatedAt,
        });
        store.dispatch(
          setCredentials({
            user: me.data.user,
            accessToken,
            refreshToken: stored.refreshToken,
          }),
        );
        const customerRes = await customerService.getCustomerById(me.data.user.id);
        if (customerRes.success) {
          store.dispatch(setCustomer(customerRes.data.customer));
        }
        return routeAfterAuth(me.data.user);
      }
    } catch {
      await authStorage.clear();
      store.dispatch(logout());
    }
  }

  return "SignUp";
}

async function resolveUnauthenticatedRoute(): Promise<InitialRoute> {
  const location = await Location.getForegroundPermissionsAsync();
  if (location.status !== "granted") {
    return "OnboardLocationAccess";
  }

  const notifications = await Notifications.getPermissionsAsync();
  if (notifications.status !== "granted") {
    return "OnboardNotificationsAccess";
  }

  return "SignUp";
}

export async function resolveInitialRoute(): Promise<{
  route: InitialRoute;
  params?: InitialRouteParams;
}> {
  const stored = await authStorage.get();

  if (stored && authStorage.isSessionValid(stored)) {
    const route = await restoreAuthenticatedUser(stored);
    return { route };
  }

  if (stored) {
    await authStorage.clear();
    store.dispatch(logout());
  }

  const route = await resolveUnauthenticatedRoute();
  return { route };
}

export async function saveAuthSession(params: {
  userId: string;
  accessToken: string;
  refreshToken: string;
}) {
  await authStorage.save({
    ...params,
    lastAuthenticatedAt: new Date().toISOString(),
  });
}
