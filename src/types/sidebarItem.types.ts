import { RootStackParamList } from "../navigation/types";

export type SidebarMenuItem = {
  key: string;
  label: string;
  icon: string;
  navigate: keyof RootStackParamList;
};