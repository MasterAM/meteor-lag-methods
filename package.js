Package.describe({
  name: 'alon:lag-methods',
  summary: 'A configurable dev-only package that adds lag to your Meteor methods.',
  version: '0.1.1',
  git: 'https://github.com/MasterAM/meteor-lag-methods',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.use('check');
  api.addFiles('lib/lag-methods.js', 'server');
  api.export('LagMethods', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('alon:lag-methods');
  api.addFiles('tests/server/configs.js', 'server');
  api.addFiles('tests/server/server-test.js', 'server');
  api.addFiles('tests/client/client-test.js', 'client');
});
