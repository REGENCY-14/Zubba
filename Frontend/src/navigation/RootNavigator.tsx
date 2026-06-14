import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LandingScreen } from '../screens/LandingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { EmailSignUpScreen } from '../screens/EmailSignUpScreen';
import { LocationSharingScreen } from '../screens/LocationSharingScreen';
import { ScanningScreen } from '../screens/ScanningScreen';
import { DriverArrivesScreen } from '../screens/DriverArrivesScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { PaymentMethodScreen } from '../screens/PaymentMethodScreen';
import { PaymentVerificationScreen } from '../screens/PaymentVerificationScreen';
import { AuthorizePaymentScreen } from '../screens/AuthorizePaymentScreen';
import { PaymentSuccessScreen } from '../screens/PaymentSuccessScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TermsAndConditionsScreen } from '../screens/TermsAndConditionsScreen';
import { AboutUsScreen } from '../screens/AboutUsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { ActiveSessionScreen } from '../screens/ActiveSessionScreen';
import { UpdateDetailsScreen } from '../screens/UpdateDetailsScreen';
import { UpdateDetailsOtpScreen } from '../screens/UpdateDetailsOtpScreen';
import { UpdateDetailsSuccessScreen } from '../screens/UpdateDetailsSuccessScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { FindAccountScreen } from '../screens/FindAccountScreen';
import { FindAccountEmailScreen } from '../screens/FindAccountEmailScreen';
import { FindAccountOtpScreen } from '../screens/FindAccountOtpScreen';
import { FindAccountEmailOtpScreen } from '../screens/FindAccountEmailOtpScreen';
import { VerifyOtpScreen } from '../screens/VerifyOtpScreen';
import { NewUserOnboardingScreen } from '../screens/NewUserOnboardingScreen';
import { KycCollectionScreen } from '../screens/KycCollectionScreen';
import { TermsAcceptanceScreen } from '../screens/TermsAcceptanceScreen';
import { ChoosePlanScreen } from '../screens/ChoosePlanScreen';
import { ConfirmSubscriptionScreen } from '../screens/ConfirmSubscriptionScreen';
import { AddCardScreen } from '../screens/AddCardScreen';
import { PremiumPaymentScreen } from '../screens/PremiumPaymentScreen';
import { WalletNumberScreen } from '../screens/WalletNumberScreen';
import { PremiumHomeScreen } from '../screens/PremiumHomeScreen';
import { DriversFoundScreen } from '../screens/DriversFoundScreen';
import { WalletCheckoutScreen } from '../screens/WalletCheckoutScreen';
import type { RootStackParamList } from './types';

const { SignInScreen } = require('../screens/SignInScreen');
const { ExistingUserNotificationScreen } = require('../screens/ExistingUserNotificationScreen');

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
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
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExistingUserNotification" component={ExistingUserNotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LocationSharing" component={LocationSharingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Scanning" component={ScanningScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DriverArrives" component={DriverArrivesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentVerification" component={PaymentVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AuthorizePayment" component={AuthorizePaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: false }} />
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
