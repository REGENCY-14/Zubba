import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LandingScreen } from '../screens/auth/LandingScreen';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { EmailSignUpScreen } from '../screens/auth/EmailSignUpScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ScanningScreen } from '../screens/pickup/ScanningScreen';
import { DriverArrivesScreen } from '../screens/pickup/DriverArrivesScreen';
import { PaymentScreen } from '../screens/payments/PaymentScreen';
import { PaymentMethodScreen } from '../screens/payments/PaymentMethodScreen';
import { PaymentVerificationScreen } from '../screens/payments/PaymentVerificationScreen';
import { AuthorizePaymentScreen } from '../screens/payments/AuthorizePaymentScreen';
import { PaymentSuccessScreen } from '../screens/payments/PaymentSuccessScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { TermsAndConditionsScreen } from '../screens/onboarding/TermsAndConditionsScreen';
import { AboutUsScreen } from '../screens/support/AboutUsScreen';
import { NotificationsScreen } from '../screens/support/NotificationsScreen';
import { HelpCenterScreen } from '../screens/support/HelpCenterScreen';
import { ActiveSessionScreen } from '../screens/pickup/ActiveSessionScreen';
import { UpdateDetailsScreen } from '../screens/profile/UpdateDetailsScreen';
import { UpdateDetailsOtpScreen } from '../screens/profile/UpdateDetailsOtpScreen';
import { UpdateDetailsSuccessScreen } from '../screens/profile/UpdateDetailsSuccessScreen';
import { DetailsScreen } from '../screens/home/DetailsScreen';
import { FindAccountScreen } from '../screens/account-recovery/FindAccountScreen';
import { FindAccountEmailScreen } from '../screens/account-recovery/FindAccountEmailScreen';
import { FindAccountOtpScreen } from '../screens/account-recovery/FindAccountOtpScreen';
import { FindAccountEmailOtpScreen } from '../screens/account-recovery/FindAccountEmailOtpScreen';
import { VerifyOtpScreen } from '../screens/auth/VerifyOtpScreen';
import { NewUserOnboardingScreen } from '../screens/onboarding/NewUserOnboardingScreen';
import { OnboardLocationAccessScreen } from '../screens/onboarding/OnboardLocationAccessScreen';
import { OnboardNotificationsAccessScreen } from '../screens/onboarding/OnboardNotificationsAccessScreen';
import { KycCollectionScreen } from '../screens/onboarding/KycCollectionScreen';
import { TermsAcceptanceScreen } from '../screens/support/TermsAcceptanceScreen';
import { ChoosePlanScreen } from '../screens/payments/ChoosePlanScreen';
import { ConfirmSubscriptionScreen } from '../screens/payments/ConfirmSubscriptionScreen';
import { AddCardScreen } from '../screens/payments/AddCardScreen';
import { PremiumPaymentScreen } from '../screens/payments/PremiumPaymentScreen';
import { WalletNumberScreen } from '../screens/payments/WalletNumberScreen';
import { PremiumHomeScreen } from '../screens/payments/PremiumHomeScreen';
import { DriversFoundScreen } from '../screens/payments/DriversFoundScreen';
import { WalletCheckoutScreen } from '../screens/payments/WalletCheckoutScreen';
import type { RootStackParamList } from './types';

import { SignInScreen } from '../screens/auth/SignInScreen';
import { ExistingUserNotificationScreen } from '../screens/auth/ExistingUserNotificationScreen';
import RateRideScreen from '../screens/payments/RateRideScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F172A'
        },
        headerTintColor: '#F8FAFC',
        contentStyle: {
          backgroundColor: '#F8FAFC'
        }
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardLocationAccess" component={OnboardLocationAccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardNotificationsAccess" component={OnboardNotificationsAccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExistingUserNotification" component={ExistingUserNotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Scanning" component={ScanningScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DriverArrives" component={DriverArrivesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentVerification" component={PaymentVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AuthorizePayment" component={AuthorizePaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RateRide" component={RateRideScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateDetailsOtp" component={UpdateDetailsOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateDetailsSuccess" component={UpdateDetailsSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Verify" component={VerifyOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NewUserOnboarding" component={NewUserOnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="KycCollection" component={KycCollectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsAcceptance" component={TermsAcceptanceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChoosePlan" component={ChoosePlanScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ConfirmSubscription" component={ConfirmSubscriptionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddCard" component={AddCardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PremiumPayment" component={PremiumPaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WalletNumber" component={WalletNumberScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PremiumHome" component={PremiumHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DriversFound" component={DriversFoundScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WalletCheckout" component={WalletCheckoutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="FindAccount" component={FindAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindAccountEmail" component={FindAccountEmailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindAccountOtp" component={FindAccountOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindAccountEmailOtp" component={FindAccountEmailOtpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
