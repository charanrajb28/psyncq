import 'package:flutter/material.dart';

import 'core/di/app_dependencies.dart';
import 'core/routing/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/authentication/presentation/login_screen.dart';
import 'features/authentication/data/auth_client.dart';
import 'features/connected_accounts/data/connected_accounts_client.dart';
import 'features/dashboard/presentation/dashboard_screen.dart';
import 'features/profile/presentation/profile_screen.dart';

class PSyncQApp extends StatelessWidget {
  const PSyncQApp({required this.dependencies, super.key});

  final AppDependencies dependencies;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PSyncQ',
      debugShowCheckedModeBanner: dependencies.config.showDebugBanner,
      theme: AppTheme.light,
      home: _AuthGate(dependencies: dependencies),
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
            onProfile: () async {
              try {
                final user = await AuthClient(
                        baseUrl: dependencies.config.apiBaseUrl)
                    .currentUser();
                if (context.mounted) {
                  Navigator.of(context).push(MaterialPageRoute(
                      builder: (_) => ProfileScreen(
                          user: user,
                          onBack: () => Navigator.of(context).pop())));
                }
              } catch (error) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context)
                      .showSnackBar(SnackBar(content: Text(error.toString())));
                }
              }
            },
            onSignOut: () async {
              await AuthClient(baseUrl: dependencies.config.apiBaseUrl)
                  .signOut();
              if (context.mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil(
                    AppRoutes.login, (route) => false);
              }
            },
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

class _AuthGate extends StatefulWidget {
  const _AuthGate({required this.dependencies});

  final AppDependencies dependencies;

  @override
  State<_AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<_AuthGate> {
  late final Future<Map<String, dynamic>> _session;

  @override
  void initState() {
    super.initState();
    _session = AuthClient(baseUrl: widget.dependencies.config.apiBaseUrl)
        .currentUser();
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<Map<String, dynamic>>(
      future: _session,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
              body: Center(child: CircularProgressIndicator()));
        }
        if (snapshot.hasData) {
          return DashboardScreen(
              onProfile: () => _openProfile(context),
              onSignOut: () async {
                await AuthClient(
                        baseUrl: widget.dependencies.config.apiBaseUrl)
                    .signOut();
                if (context.mounted) {
                  Navigator.of(context).pushNamedAndRemoveUntil(
                      AppRoutes.login, (route) => false);
                }
              },
              onConnectAccount: () async {
                try {
                  await ConnectedAccountsClient(
                          baseUrl: widget.dependencies.config.apiBaseUrl)
                      .beginGoogleConnection();
                } catch (error) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(error.toString())));
                  }
                }
              });
        }
        return LoginScreen(onSignedIn: (email, password, registering) async {
          final auth = AuthClient(baseUrl: widget.dependencies.config.apiBaseUrl);
          if (registering) {
            await auth.register(email: email.trim(), password: password);
          } else {
            await auth.signIn(email: email.trim(), password: password);
          }
          if (context.mounted) {
            Navigator.of(context).pushReplacementNamed(AppRoutes.dashboard);
          }
        });
      });

  Future<void> _openProfile(BuildContext context) async {
    try {
      final user = await AuthClient(
              baseUrl: widget.dependencies.config.apiBaseUrl)
          .currentUser();
      if (context.mounted) {
        Navigator.of(context).push(MaterialPageRoute(
            builder: (_) => ProfileScreen(
                user: user,
                onBack: () => Navigator.of(context).pop())));
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.toString())));
      }
    }
  }
}
