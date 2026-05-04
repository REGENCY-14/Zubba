import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LandingScreen } from '../screens/LandingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { EmailSignUpScreen } from '../screens/EmailSignUpScreen';
import { LocationSharingScreen } from '../screens/LocationSharingScreen';
import { ScanningScreen } from '../screens/ScanningScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { FindAccountScreen } from '../screens/FindAccountScreen';
import { FindAccountEmailScreen } from '../screens/FindAccountEmailScreen';
import { FindAccountOtpScreen } from '../screens/FindAccountOtpScreen';
import { FindAccountEmailOtpScreen } from '../screens/FindAccountEmailOtpScreen';
import { VerifyOtpScreen } from '../screens/VerifyOtpScreen';
import { NewUserOnboardingScreen } from '../screens/NewUserOnboardingScreen';
import { KycCollectionScreen } from '../screens/KycCollectionScreen';
import { TermsAcceptanceScreen } from '../screens/TermsAcceptanceScreen';
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
      <Stack.Screen name="Verify" component={VerifyOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NewUserOnboarding" component={NewUserOnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="KycCollection" component={KycCollectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsAcceptance" component={TermsAcceptanceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="FindAccount" component={FindAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindAccountEmail" component={FindAccountEmailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindAccountOtp" component={FindAccountOtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindAccountEmailOtp" component={FindAccountEmailOtpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
