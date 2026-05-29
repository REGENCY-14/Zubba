import 'package:flutter/material.dart';
import 'package:zubba/screens/onboarding/onboard_screen.dart';
import 'package:zubba/screens/onboarding/views/stay_updated_screen.dart';

final Map<String, WidgetBuilder> appRoutes = {
  "/onboard1": (_) => OnboardScreen(),
  "/onboard2": (_) => StayUpdatedScreen(),
};