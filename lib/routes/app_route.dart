import 'package:flutter/material.dart';
import 'package:zubba/screens/onboarding/after_splash_screen.dart';
import 'package:zubba/screens/onboarding/stay_updated_screen.dart';

final Map<String, WidgetBuilder> appRoutes = {
  "/onboard1": (_) => AfterSplashScreen(),
  "/onboard2": (_) => StayUpdatedScreen(),
};