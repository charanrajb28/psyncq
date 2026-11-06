import 'package:flutter_test/flutter_test.dart';

import 'package:psyncq/app.dart';
import 'package:psyncq/core/di/app_dependencies.dart';
import 'package:psyncq/core/config/app_config.dart';

void main() {
  testWidgets('shows PSyncQ sign-in screen', (tester) async {
    await tester.pumpWidget(const PSyncQApp(
        dependencies: AppDependencies(
            config: AppConfig(
                environment: AppEnvironment.development,
                apiBaseUrl: 'http://localhost:3000',
                showDebugBanner: true))));
    expect(find.text('PSyncQ'), findsOneWidget);
    expect(find.text('Sign in'), findsOneWidget);
  });

  testWidgets('navigates from sign-in to dashboard', (tester) async {
    await tester.pumpWidget(const PSyncQApp(
        dependencies: AppDependencies(
            config: AppConfig(
                environment: AppEnvironment.development,
                apiBaseUrl: 'http://localhost:3000',
                showDebugBanner: true))));
    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();
    expect(find.text('Good morning, Alex'), findsOneWidget);
  });
}
