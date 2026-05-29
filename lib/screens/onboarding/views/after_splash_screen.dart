import 'package:flutter/material.dart';
import 'package:zubba/utils/request_permissions.dart';

class AfterSplashScreen extends StatefulWidget {
  const AfterSplashScreen({super.key});

  @override
  State<AfterSplashScreen> createState() => _AfterSplashScreenState();
}

class _AfterSplashScreenState extends State<AfterSplashScreen> {
  Future<void> _requestPermission () async {
    await requestLocation();
    // ignore: use_build_context_synchronously
    Navigator.pushNamed(context, "/onboard2");
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white
            ),
            child: Center(
              child: Image.asset("assets/images/zubba_text_green.png", height: 100,),
            ),
          )
        ),
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: InkWell(
            onTap: _requestPermission,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              width: double.maxFinite,
              decoration: BoxDecoration(
                color: Colors.green.shade700
              ),
              child: Row(
                spacing: 8,
                children: [
                  Icon(Icons.location_on_outlined, color: Colors.white, size: 20),
                  Text(
                    "Location sharing is disabled. Tap here to enable",
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 12,
                      color: Colors.white
                    )
                  ),
                  Spacer(),
                  Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 20)
                ]
              )
            ),
          )
        ),
      ],
    );
  }
}