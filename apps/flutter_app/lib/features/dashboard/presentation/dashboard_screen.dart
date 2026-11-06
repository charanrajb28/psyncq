import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen(
      {required this.onSignOut, this.onProfile, this.onConnectAccount, super.key});

  final VoidCallback onSignOut;
  final VoidCallback onProfile;
  final Future<void> Function()? onConnectAccount;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selected = 0;
  final _items = const [
    'Dashboard',
    'All files',
    'Connected accounts',
    'Migration',
    'Analytics',
    'Activity',
    'Settings'
  ];

  @override
  Widget build(BuildContext context) {
    final compact = MediaQuery.sizeOf(context).width < 850;
    return Scaffold(
      appBar: compact ? AppBar(title: const Text('PSyncQ')) : null,
      drawer: compact ? Drawer(child: _sidebar()) : null,
      body: Row(
          children: [if (!compact) _sidebar(), Expanded(child: _content())]),
    );
  }

  Widget _sidebar() => Container(
      width: 244,
      color: AppTheme.navy,
      padding: const EdgeInsets.fromLTRB(20, 34, 16, 20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('PSyncQ',
            style: TextStyle(
                color: Colors.white,
                fontSize: 25,
                fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        const Text('One file manager.\nMultiple clouds.',
            style: TextStyle(color: Color(0xFF9BA8C6), height: 1.4)),
        const SizedBox(height: 42),
        ...List.generate(
            _items.length,
            (index) => ListTile(
                leading: Icon(_iconFor(index),
                    color: index == _selected
                        ? Colors.white
                        : const Color(0xFF9BA8C6)),
                title: Text(_items[index],
                    style: TextStyle(
                        color: index == _selected
                            ? Colors.white
                            : const Color(0xFF9BA8C6),
                        fontWeight: index == _selected
                            ? FontWeight.w700
                            : FontWeight.w400)),
                selected: index == _selected,
                selectedTileColor: AppTheme.blue,
                shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(12))),
                onTap: () => setState(() => _selected = index))),
        const Spacer(),
        ListTile(
            leading: const Icon(Icons.logout, color: Color(0xFF9BA8C6)),
            title: const Text('Sign out',
                style: TextStyle(color: Color(0xFF9BA8C6))),
            onTap: widget.onSignOut),
      ]));

  IconData _iconFor(int index) => [
        Icons.grid_view_rounded,
        Icons.folder_copy_outlined,
        Icons.cloud_outlined,
        Icons.sync_alt,
        Icons.pie_chart_outline,
        Icons.history,
        Icons.settings_outlined
      ][index];

  Widget _content() => SingleChildScrollView(
      padding: const EdgeInsets.all(32),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                Text('Good morning, Alex',
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w800, color: AppTheme.navy)),
                const SizedBox(height: 6),
                const Text(
                    'Here is what is happening across your connected drives.',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(color: Colors.blueGrey))
              ])),
          const SizedBox(width: 16),
          IconButton(
              tooltip: 'Profile',
              onPressed: widget.onProfile,
              icon: const CircleAvatar(
                  backgroundColor: Color(0xFFE3EAFE),
                  child: Text('U',
                      style: TextStyle(
                          color: AppTheme.blue, fontWeight: FontWeight.bold))))
        ]),
        const SizedBox(height: 30),
        LayoutBuilder(
            builder: (context, constraints) => GridView.count(
                    crossAxisCount: constraints.maxWidth > 900
                        ? 3
                        : constraints.maxWidth > 580
                            ? 2
                            : 1,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    childAspectRatio: 1.7,
                    children: const [
                      _StatCard(
                          label: 'Total storage',
                          value: '1.84 TB',
                          detail: 'of 3 TB available',
                          icon: Icons.storage_outlined,
                          color: AppTheme.blue),
                      _StatCard(
                          label: 'Files managed',
                          value: '12,486',
                          detail: 'Across 2 accounts',
                          icon: Icons.insert_drive_file_outlined,
                          color: AppTheme.mint),
                      _StatCard(
                          label: 'Active transfers',
                          value: '3',
                          detail: '2 uploads · 1 migration',
                          icon: Icons.sync,
                          color: Color(0xFFF0A74B))
                    ])),
        const SizedBox(height: 28),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Connected accounts',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800, color: AppTheme.navy)),
          TextButton.icon(
              onPressed: widget.onConnectAccount == null
                  ? null
                  : () => widget.onConnectAccount!(),
              icon: const Icon(Icons.add),
              label: const Text('Connect account'))
        ]),
        const SizedBox(height: 12),
        const _AccountCard(
            name: 'alex.personal@gmail.com',
            label: 'Personal Drive',
            used: '342 GB',
            total: '2 TB',
            color: Color(0xFF4285F4)),
        const SizedBox(height: 12),
        const _AccountCard(
            name: 'alex@studio.co',
            label: 'Work Drive',
            used: '1.5 TB',
            total: '1 TB',
            color: Color(0xFF34A853),
            overCapacity: true),
      ]));
}

class _StatCard extends StatelessWidget {
  const _StatCard(
      {required this.label,
      required this.value,
      required this.detail,
      required this.icon,
      required this.color});
  final String label, value, detail;
  final IconData icon;
  final Color color;
  @override
  Widget build(BuildContext context) => Card(
      child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(label,
                          style: const TextStyle(color: Colors.blueGrey)),
                      Icon(icon, color: color)
                    ]),
                Text(value,
                    style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.navy)),
                Text(detail,
                    style:
                        const TextStyle(fontSize: 12, color: Colors.blueGrey))
              ])));
}

class _AccountCard extends StatelessWidget {
  const _AccountCard(
      {required this.name,
      required this.label,
      required this.used,
      required this.total,
      required this.color,
      this.overCapacity = false});
  final String name, label, used, total;
  final Color color;
  final bool overCapacity;
  @override
  Widget build(BuildContext context) => Card(
      child: ListTile(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          leading: CircleAvatar(
              backgroundColor: color,
              child: const Icon(Icons.cloud, color: Colors.white)),
          title: Text(label,
              style: const TextStyle(
                  fontWeight: FontWeight.w700, color: AppTheme.navy)),
          subtitle: Text(name),
          trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text('$used / $total',
                    style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: overCapacity ? Colors.red : AppTheme.navy)),
                Text(overCapacity ? 'Capacity exceeded' : 'Connected',
                    style: TextStyle(
                        fontSize: 12,
                        color: overCapacity ? Colors.red : AppTheme.mint))
              ])));
}
