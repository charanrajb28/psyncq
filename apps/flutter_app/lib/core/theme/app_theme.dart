import 'package:flutter/material.dart';

class AppTheme {
  static const navy = Color(0xFF17233D);
  static const blue = Color(0xFF3D6EF7);
  static const mint = Color(0xFF33C7A5);
  static const canvas = Color(0xFFF5F7FB);

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: canvas,
        colorScheme:
            ColorScheme.fromSeed(seedColor: blue, brightness: Brightness.light),
        fontFamily: 'Arial',
        appBarTheme: const AppBarTheme(backgroundColor: canvas, elevation: 0),
        cardTheme: const CardThemeData(
          color: Colors.white,
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(18))),
        ),
      );
}
