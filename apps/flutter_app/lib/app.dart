import 'package:flutter/material.dart';

import 'core/di/app_dependencies.dart';
import 'core/routing/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/authentication/presentation/login_screen.dart';
import 'features/authentication/data/auth_client.dart';
import 'features/connected_accounts/data/connected_accounts_client.dart';
import 'features/dashboard/presentation/dashboard_screen.dart';

class PSyncQApp extends StatelessWidget {
  const PSyncQApp({required this.dependencies, super.key});

  final AppDependencies dependencies;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PSyncQ',
      debugShowCheckedModeBanner: dependencies.config.showDebugBanner,
      theme: AppTheme.light,
      initialRoute: AppRoutes.login,
      routes: {
        AppRoutes.login: (context) => LoginScreen(onSignedIn:
            (email, password, registering) async {
          final auth = AuthClient(baseUrl: dependencies.config.apiBaseUrl);
          if (registering) {
            await auth.register(email: email.trim(), password: password);
          } else {
            await auth.signIn(email: email.trim(), password: password);
          }
          if (context.mounted) {
            Navigator.of(context).pushReplacementNamed(AppRoutes.dashboard);
          }
        }),
        AppRoutes.dashboard: (context) => DashboardScreen(
            onSignOut: () =>
                Navigator.of(context).pushReplacementNamed(AppRoutes.login),
            onConnectAccount: () async {
              try {
                await ConnectedAccountsClient(
                        baseUrl: dependencies.config.apiBaseUrl)
                    .beginGoogleConnection();
              } catch (error) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context)
                      .showSnackBar(SnackBar(content: Text(error.toString())));
                }
              }
            }),
      },
    );
  }
}
