'use strict';
// wrap Meteor.methods
var _methods = Meteor.methods;

Meteor.methods = function (methods) {
  return _methods.apply(this, [Lag.wrapMethods(methods)]);
};

// rewrite currently registered methods
Meteor.server.method_handlers = Lag.wrapMethods(Meteor.server.method_handlers);

// initialize the package configuration
Lag.initConfig();
ConfigCache.cacheCollection(lagCollection, Lag.currentConfig);