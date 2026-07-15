import { SidebarMenuItem } from "../types/sidebarItem.types";

export const top_sidebar_items: SidebarMenuItem[] = [
  // {
  //   key:"home",
  //   label: "Home",
  //   icon: "home-outline",
  //   navigate: "Home"
  // },
  {
    key: "profile",
    label: "Profile",
    icon: "account-outline",
    navigate: "Profile",
  },
  {
    key: "wallet",
    label: "Zubba Wallet",
    icon: "wallet-outline",
    navigate: "ZubbaWallet",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "cog-outline",
    navigate: "Settings",
  },
];

export const noPlanSidebarItem: SidebarMenuItem = {
  key: "subscription",
  label: "Subscription",
  icon: "account-star-outline",
  navigate: "ManageSubscription",
};

export const isPremiumSidebarItem: SidebarMenuItem = {
  key: "chooseplan",
  label: "Subscription",
  icon: "crown-outline",
  navigate: "ConfirmSubscription",
};

export const bottom_sidebar_items: SidebarMenuItem[] = [
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
