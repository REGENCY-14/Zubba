import { Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export type WelcomeContext = {
  isFirstLogin?: boolean;
  previousLogin?: { authKey: string; authValue: string } | null;
  matchesCurrentLogin?: boolean;
  currentContact?: string;
};

function formatContact(authKey?: string, value?: string) {
  if (!value) return "";
  if (authKey === "email") return value;
  return value;
}

export function WelcomeMessage({ context }: { context?: WelcomeContext }) {
  const { colors } = useTheme();
  const current = context?.currentContact ?? "";

  let message = "Welcome back!";

  if (context?.isFirstLogin) {
    message = "Welcome! This looks like your first time signing in.";
  } else if (context?.matchesCurrentLogin && current) {
    message = `You previously signed in to our apps using this ${context.previousLogin?.authKey === "email" ? "email" : "phone number"}: ${current}`;
  } else if (context?.previousLogin?.authValue) {
    const label = context.previousLogin.authKey === "email" ? "email" : "phone number";
    message = `You previously signed in using this ${label}: ${formatContact(context.previousLogin.authKey, context.previousLogin.authValue)}`;
  } else if (current) {
    message = `You previously signed in to one of our apps using ${current}`;
  }

  return (
    <Text
      style={{
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "300",
        color: colors.textSub,
        textAlign: "center",
        marginTop: 8,
        maxWidth: 366,
      }}
    >
      {message}
    </Text>
  );
}
