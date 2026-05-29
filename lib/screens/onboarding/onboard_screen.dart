import 'package:flutter/material.dart';
import 'package:zubba/screens/onboarding/views/after_splash_screen.dart';

class OnboardScreen extends StatefulWidget {
  const OnboardScreen({super.key});

  @override
  State<OnboardScreen> createState() => _OnboardScreenState();
}

class _OnboardScreenState extends State<OnboardScreen> {
  int currentIndex = 0;
  List<Widget> onboardingViews = [
    AfterSplashScreen()
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: onboardingViews[currentIndex],
      ),
    );
  }
}