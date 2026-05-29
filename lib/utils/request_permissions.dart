import 'package:permission_handler/permission_handler.dart';

Future<void> requestLocation () async {
  if(!(await Permission.location.isGranted)){
    Permission.location.request();
  }
}

Future<void> requestNotification () async {
  if(!(await Permission.notification.isGranted)){
    Permission.notification.request();
  }
}