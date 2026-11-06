import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({required this.onSignedIn, super.key});

  final Future<void> Function(String email, String password, bool registering)
      onSignedIn;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _isRegistering = false;
  bool _isSubmitting = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 460),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(36),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const _Brand(),
                      const SizedBox(height: 42),
                      Text(
                          _isRegistering
                              ? 'Create your workspace'
                              : 'Welcome back',
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.navy)),
                      const SizedBox(height: 8),
                      Text(
                          _isRegistering
                              ? 'Start managing your cloud files in one place.'
                              : 'Sign in to continue to your unified file manager.',
                          style: TextStyle(color: Colors.blueGrey.shade600)),
                      const SizedBox(height: 28),
                      TextField(
                          controller: _email,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                              labelText: 'Email address',
                              prefixIcon: Icon(Icons.mail_outline))),
                      const SizedBox(height: 16),
                      TextField(
                          controller: _password,
                          obscureText: true,
                          decoration: const InputDecoration(
                              labelText: 'Password',
                              prefixIcon: Icon(Icons.lock_outline))),
                      const SizedBox(height: 24),
                      if (_error != null)
                        Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: Text(_error!,
                                style: const TextStyle(color: Colors.red))),
                      FilledButton(
                          onPressed: _isSubmitting
                              ? null
                              : () async {
                                  setState(() {
                                    _isSubmitting = true;
                                    _error = null;
                                  });
                                  try {
                                    await widget.onSignedIn(_email.text,
                                        _password.text, _isRegistering);
                                  } catch (error) {
                                    if (mounted) {
                                      setState(() => _error =
                                          error.toString().replaceFirst(
                                              'Exception: ', ''));
                                    }
                                  } finally {
                                    if (mounted) {
                                      setState(() => _isSubmitting = false);
                                    }
                                  }
                                },
                          child: _isSubmitting
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                      strokeWidth: 2))
                              : Text(
                              _isRegistering ? 'Create account' : 'Sign in')),
                      const SizedBox(height: 12),
                      TextButton(
                          onPressed: () =>
                              setState(() => _isRegistering = !_isRegistering),
                          child: Text(_isRegistering
                              ? 'Already have an account? Sign in'
                              : 'New to PSyncQ? Create an account')),
                      const SizedBox(height: 20),
                      const Text(
                          'Your account is securely stored in the PSyncQ backend.',
                          textAlign: TextAlign.center,
                          style:
                              TextStyle(fontSize: 12, color: Colors.blueGrey)),
                    ]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand();

  @override
  Widget build(BuildContext context) => Row(children: [
        Container(
            width: 42,
            height: 42,
            decoration: const BoxDecoration(
                color: AppTheme.blue,
                borderRadius: BorderRadius.all(Radius.circular(13))),
            child: const Icon(Icons.all_inclusive, color: Colors.white)),
        const SizedBox(width: 12),
        const Text('PSyncQ',
            style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.w800,
                color: AppTheme.navy)),
      ]);
}
