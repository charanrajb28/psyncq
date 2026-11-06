enum AppEnvironment { development, staging, production }

class AppConfig {
  const AppConfig(
      {required this.environment,
      required this.apiBaseUrl,
      required this.showDebugBanner});

  final AppEnvironment environment;
  final String apiBaseUrl;
  final bool showDebugBanner;

  factory AppConfig.fromEnvironment() {
    const rawEnvironment =
        String.fromEnvironment('APP_ENV', defaultValue: 'development');
    const rawApiBaseUrl = String.fromEnvironment('API_BASE_URL',
        defaultValue: 'http://localhost:3000');
    final environment = switch (rawEnvironment) {
      'staging' => AppEnvironment.staging,
      'production' => AppEnvironment.production,
      _ => AppEnvironment.development,
    };
    return AppConfig(
        environment: environment,
        apiBaseUrl: rawApiBaseUrl,
        showDebugBanner: environment != AppEnvironment.production);
  }
}
