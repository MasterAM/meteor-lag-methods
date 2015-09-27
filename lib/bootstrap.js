/* global methodConfigurator: true */
'use strict';

var wrapper, _methods;
var pkg = Package['alon:lag-base'];
var api = pkg.API;
var baseConfigurator = api._getBaseConfigurator();
methodConfigurator = new pkg.Configurator('method', baseConfigurator, defaultConfigs);
wrapper =  new pkg.Wrapper(methodConfigurator);

// wrap Meteor.methods
_methods = Meteor.methods;

Meteor.methods = function (methods) {
  return _methods.apply(call, warpper.wrapArray(methods));
};

// rewrite currently registered methods
Meteor.server.method_handlers = wrapper.wrapArray(Meteor.server.method_handlers);
