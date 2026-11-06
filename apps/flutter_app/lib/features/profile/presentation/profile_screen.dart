import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({required this.user, required this.onBack, super.key});

  final Map<String, dynamic> user;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final username = user['username'] as String? ?? 'User';
    final email = user['email'] as String? ?? 'Email unavailable';
    final initial = username.isEmpty ? 'U' : username[0].toUpperCase();
    return Scaffold(
      appBar: AppBar(
          leading: IconButton(
              onPressed: onBack, icon: const Icon(Icons.arrow_back)),
          title: const Text('Profile')),
      body: Center(
          child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 620),
              child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Card(
                      child: Padding(
                          padding: const EdgeInsets.all(32),
                          child: Column(children: [
                            CircleAvatar(
                                radius: 42,
                                backgroundColor: const Color(0xFFE3EAFE),
                                child: Text(initial,
                                    style: const TextStyle(
                                        fontSize: 32,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.blue))),
                            const SizedBox(height: 20),
                            Text(username,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineSmall
                                    ?.copyWith(
                                        fontWeight: FontWeight.w800,
                                        color: AppTheme.navy)),
                            const SizedBox(height: 6),
                            Text(email,
                                style: const TextStyle(color: Colors.blueGrey)),
                            const SizedBox(height: 28),
                            _ProfileRow(
                                icon: Icons.person_outline,
                                label: 'Username',
                                value: username),
                            _ProfileRow(
                                icon: Icons.email_outlined,
                                label: 'Email address',
                                value: email),
                            _ProfileRow(
                                icon: Icons.verified_user_outlined,
                                label: 'Account status',
                                value: 'Active'),
                          ]))))),
    );
  }
}

class _ProfileRow extends StatelessWidget {
  const _ProfileRow(
      {required this.icon, required this.label, required this.value});

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => ListTile(
      leading: Icon(icon, color: AppTheme.blue),
      title: Text(label,
          style: const TextStyle(fontSize: 12, color: Colors.blueGrey)),
      subtitle: Text(value,
          style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppTheme.navy)));
}
