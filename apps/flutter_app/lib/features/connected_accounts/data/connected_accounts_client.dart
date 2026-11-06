import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

import '../../../core/network/http_client.dart';

class ConnectedAccountsClient {
  ConnectedAccountsClient({required this.baseUrl, http.Client? client})
      : _client = client ?? createHttpClient();

  final String baseUrl;
  final http.Client _client;

  Future<void> beginGoogleConnection() async {
    final response = await _client.post(
        Uri.parse('$baseUrl/api/v1/accounts/connect'),
        headers: const {'Content-Type': 'application/json'},
        body: jsonEncode({}));
    if (response.statusCode != 200) {
      throw Exception(
          'Unable to start Google account connection (${response.statusCode})');
    }
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    final url =
        (body['data'] as Map<String, dynamic>)['authorization_url'] as String;
    if (!await launchUrl(Uri.parse(url),
        mode: LaunchMode.externalApplication)) {
      throw Exception('Unable to open Google authorization');
    }
  }
}
