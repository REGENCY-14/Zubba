import { SidebarMenuItem } from "../types/sidebarItem.types";

export const top_sidebar_items: SidebarMenuItem[] = [
  {
    key: "profile",
    label: "Profile",
    icon: "account-outline",
    navigate: "Profile",
  }
];

export const noPlanSidebarItem: SidebarMenuItem = {
  key: "subscription",
  label: "Subscription",
  icon: "account-star-outline",
  navigate: "ChoosePlan",
};

export const isPremiumSidebarItems: SidebarMenuItem[] = [
  {
    key: "wallet",
    label: "Zubba Wallet",
    icon: "wallet-outline",
    navigate: "ZubbaWallet",
  },
  {
    key: "chooseplan",
    label: "Subscription",
    icon: "crown-outline",
    navigate: "ManageSubscription",
  },
];

export const bottom_sidebar_items: SidebarMenuItem[] = [
  {
    key: "settings",
    label: "Settings",
    icon: "cog-outline",
    navigate: "Settings",
  },
  {
    key: "support",
    label: "Support",
    icon: "face-agent",
    navigate: "HelpCenter",
  },
  {
    key: "promotions",
    label: "Promotions",
    icon: "tag-outline",
    navigate: "Promotions",
  },
];
