import '../config/app_config.dart';

class AppDependencies {
  const AppDependencies({required this.config});

  final AppConfig config;

  factory AppDependencies.fromEnvironment() =>
      AppDependencies(config: AppConfig.fromEnvironment());
}
