import 'package:flutter/material.dart';
import 'package:zubba/utils/request_permissions.dart';

class StayUpdatedScreen extends StatefulWidget {
  const StayUpdatedScreen({super.key});

  @override
  State<StayUpdatedScreen> createState() => _StayUpdatedScreenState();
}

class _StayUpdatedScreenState extends State<StayUpdatedScreen> {
  @override
  Widget build(BuildContext context) {
    Future<void> requestPermission () async {
      await requestNotification();

    }

    return Column(
      children: [
        Expanded(child: Center(
          child: Column(
            spacing: 12,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset("assets/images/notification_alert.png", height: 228,),
              Text("Stay updated on requests and promos.",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold
                )
              ),
              Text("Get notified when your driver is nearby and for job updates",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w300,
                ),
              ),
            ],
          ),
        )),
        TextButton(
          onPressed: requestPermission,
          style: TextButton.styleFrom(
            backgroundColor: Colors.green.shade600,
            foregroundColor: Colors.white,
          ),
          child: Text("Get notified",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w300
            ),
          )
        )
      ],
    );
  }
}