Package.describe({
  name: 'alon:lag-methods',
  summary: 'Adds delay to method calls on your development machine.',
  version: '0.4.0',
  git: 'https://github.com/MasterAM/meteor-lag-methods',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.use(['check', 'underscore', 'reactive-dict', 'mongo']);
  api.addFiles([
    'lib/globals.js',
    'lib/lag-methods.js',
    'lib/caching.js',
    'lib/configurator.js',
    'lib/bootstrap.js'
  ], 'server');
  api.export('LagMethods', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('alon:lag-methods');
  api.addFiles('tests/server/configs.js', 'server');
  api.addFiles('tests/server/server-test.js', 'server');
  api.addFiles('tests/client/client-test.js', 'client');
});
