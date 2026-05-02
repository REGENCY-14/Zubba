import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  SignUp: undefined;
  EmailSignUp: undefined;
  SignIn: undefined;
  ExistingUserNotification: { phone?: string; email?: string } | undefined;
  NewUserOnboarding: { phone?: string; email?: string } | undefined;
  KycCollection: { phone?: string; email?: string } | undefined;
  TermsAcceptance: { phone?: string; email?: string; firstName?: string; lastName?: string } | undefined;
  LocationSharing: undefined;
  Details: { itemId: string; title: string } | undefined;
  Verify: { phone?: string; email?: string; userExists?: boolean } | undefined;
  FindAccount: { itemId: string; title: string } | undefined;
  FindAccountEmail: undefined;
  FindAccountOtp: { phone: string } | undefined;
  FindAccountEmailOtp: { email: string } | undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
