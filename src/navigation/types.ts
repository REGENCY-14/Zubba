import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NearbyDriver } from '../types/driver.types';

export type RootStackParamList = {
  Splash: undefined;
  OnboardLocationAccess: undefined;
  OnboardNotificationsAccess: undefined;
  NotificationsList: undefined;
  Landing: undefined;
  SignUp: undefined;
  EmailSignUp: undefined;
  SignIn: { phone?: string; email?: string } | undefined;
  ExistingUserNotification: { phone?: string; email?: string } | undefined;
  NewUserOnboarding: { phone?: string; email?: string } | undefined;
  KycCollection: { phone?: string; email?: string } | undefined;
  TermsAcceptance: { phone?: string; email?: string; firstName?: string; lastName?: string } | undefined;
  Home: undefined;
  Profile: { updatedAt?: number; newPhone?: string; newEmail?: string; newFullName?: string } | undefined;
  UpdateName: undefined;
  Schedule: undefined;
  Pickups: undefined;
  Promotions: undefined;
  PremiumHome: undefined;
  ZubbaWallet: { credited?: boolean; debited?: boolean } | undefined;
  Withdraw: undefined;
  Transactions: undefined;
  CreditAccount: undefined;
  Scanning: undefined;
  DriverArrives: undefined;
  Payment: undefined;
  PaymentMethod: { method: string };
  PaymentVerification: { method: string; phone: string };
  AuthorizePayment: { method: string; phone: string };
  PaymentSuccess: { method: string; phone: string };
  ThankYou: undefined;
  RateRide: undefined;
  Settings: undefined;
  TermsAndConditions: undefined;
  AboutUs: undefined;
  NotificationSettings: undefined;
  HelpCenter: undefined;
  ActiveSession: undefined;
  UpdateDetails: { phone?: string; email?: string; kind?: 'phone' | 'email'; step?: 'old' | 'new' } | undefined;
  UpdateDetailsOtp: { phone?: string; email?: string; kind?: 'phone' | 'email'; step?: 'old' | 'new' } | undefined;
  UpdateDetailsSuccess: undefined;
  ChoosePlan: undefined;
  ManageSubscription: undefined;
  ConfirmSubscription: { planIndex?: number } | undefined;
  AddCard: { planIndex?: number } | undefined;
  PremiumPayment: undefined;
  WalletNumber: undefined;
  SavedCards: undefined;
  DriversFound: { drivers: Array<NearbyDriver> };
  WalletCheckout: undefined;
  PlanForLater: undefined;
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
