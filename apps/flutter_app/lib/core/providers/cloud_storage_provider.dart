/// Provider boundary for future Google Drive, Dropbox, and MEGA adapters.
///
/// Phase 1 intentionally contains no network implementation. Keeping the
/// contract separate from presentation prevents provider-specific assumptions
/// from leaking into the file manager.
abstract interface class CloudStorageProvider {
  Future<List<CloudFile>> listFiles({String? parentId, String? pageToken});
  Future<CloudFile> createFolder(String name, {String? parentId});
}

class CloudFile {
  const CloudFile(
      {required this.id, required this.name, required this.mimeType});

  final String id;
  final String name;
  final String mimeType;
}
