const ROUTE_TO_SIDEBAR_KEY: Record<string, string> = {
  Home: "home",
  PremiumHome: "home",
  Profile: "profile",
  ZubbaWallet: "wallet",
  ManageSubscription: "chooseplan",
  ChoosePlan: "subscription",
  Settings: "settings",
  HelpCenter: "support",
  Promotions: "promotions",
  Schedule: "schedule",
};

export function getSidebarKeyForRoute(routeName?: string): string {
  if (!routeName) return "";
  return ROUTE_TO_SIDEBAR_KEY[routeName] ?? "";
}

export function getFocusedRouteName(state: {
  index: number;
  routes: Array<{ name: string; state?: unknown }>;
}): string | undefined {
  const route = state.routes[state.index];
  if (!route) return undefined;
  if (route.state && typeof route.state === "object" && route.state !== null) {
    return getFocusedRouteName(route.state as {
      index: number;
      routes: Array<{ name: string; state?: unknown }>;
    });
  }
  return route.name;
}
