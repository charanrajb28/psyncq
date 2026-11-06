import 'package:http/http.dart' as http;

import 'client_factory.dart'
    if (dart.library.html) 'client_factory_web.dart' as client_factory;

http.Client createHttpClient() => client_factory.createHttpClient();
