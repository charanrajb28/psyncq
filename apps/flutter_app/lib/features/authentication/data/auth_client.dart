import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../core/network/http_client.dart';

class AuthClient {
  AuthClient({required this.baseUrl, http.Client? client})
      : _client = client ?? createHttpClient();

  final String baseUrl;
  final http.Client _client;

  Future<void> signIn({required String email, required String password}) =>
      _submit('/api/v1/auth/login', email: email, password: password);

  Future<void> register({required String email, required String password}) =>
      _submit('/api/v1/auth/register', email: email, password: password);

  Future<void> _submit(String path,
      {required String email, required String password}) async {
    late final http.Response response;
    try {
      response = await _client
          .post(Uri.parse('$baseUrl$path'),
              headers: const {'Content-Type': 'application/json'},
              body: jsonEncode({'email': email, 'password': password}))
          .timeout(const Duration(seconds: 15));
    } on Exception catch (error) {
      throw Exception(
          'The backend did not respond. Confirm Vercel is running on port 3000. ($error)');
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final body = jsonDecode(response.body) as Map<String, dynamic>?;
      final error = body?['error'] as Map<String, dynamic>?;
      throw Exception(error?['message'] ?? 'Authentication failed.');
    }
  }
}
