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

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            children: [
              Expanded(child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    spacing: 12,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset("assets/images/notification_alert.png", height: 230,),
                      Text("Stay updated on requests and promos.",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold
                        )
                      ),
                      Text("Get notified when your driver is nearby and for job updates",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                        ),
                      ),
                    ],
                  ),
                ),
              )),
              ConstrainedBox(
                constraints: BoxConstraints(
                  minWidth: double.maxFinite,
                  // minHeight: 100
                ),
                child: TextButton(
                  onPressed: requestPermission,
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: Colors.green.shade600,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)
                    )
                  ),
                  child: Text("Get notified",
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  )
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}