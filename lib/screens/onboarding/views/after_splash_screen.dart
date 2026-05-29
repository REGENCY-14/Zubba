import 'package:flutter/material.dart';

class AfterSplashScreen extends StatelessWidget {
  const AfterSplashScreen({super.key});

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
            onTap: (){},
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              width: double.maxFinite,
              decoration: BoxDecoration(
                color: Colors.green.shade700
              ),
              child: Row(
                spacing: 8,
                children: [
                  Icon(Icons.location_on_outlined, color: Colors.white),
                  Text("Locatoin sharing is not enabled. Tap here to enable"),
                  Spacer(),
                  Icon(Icons.arrow_forward_ios_rounded, color: Colors.white)
                ]
              )
            ),
          )
        ),
      ],
    );
  }
}