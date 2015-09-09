'use strict';
/* global LagMethods:true */

var _methods = Meteor.methods;
var Lag = {
  defaultDelay: 2000,
  delays:{},
  /**
   * Wrap a method with a delayed version.
   * @param  {String}   name of the method
   * @param  {Function} fn   the method handler (as passed to Meteor.method)
   * @return {Function}      The wrapped function
   */
  wrapMethod: function(name, fn) {
    return function() {
      Meteor._sleepForMs(Lag.getDelayForMethod(name));
      return fn.apply(this, arguments);
    }
  },
  /**
   * Get the delay for a given method name. If no delay is set, returns the default delay.
   * @param  {String} name the method name
   * @return {Number}      the delay for the given method
   */
  getDelayForMethod: function(name) {
    if (Lag.delays.hasOwnProperty(name)) {
      return Lag.delays[name];
    }
    return Lag.defaultDelay;
  },
  /**
   * Clears all of the previously set delays.
   */
  clearDelays: function() {
    this.delays = {};
  },
  /**
   * Sets a delay for a given method name.
   * @param {String} name  method name
   * @param {Number} delay delay in ms
   */
  addDelay: function(name, delay) {
    check(name, String);
    check(delay, Number);
    this.delays[name] = delay;
  }
};

/**
 * A convenience method for generating a list of wrapped methods out of an existing one.
 * @param  {Object} methods a dictionary of methods
 * @return {Object}         a dictionary of wrapped methods
 */
function wrapMethods(methods) {
  var name;

  for (name in methods) if (methods.hasOwnProperty(name)) {
    methods[name] = Lag.wrapMethod(name, methods[name]);
  }

  return methods;
}

/**
 * convenience method for processing the data from a json settings file.
 * @param  {[type]} settings [description]
 * @return {[type]}          [description]
 */
function applySettings(settings) {
  if (settings.hasOwnProperty('defaultDelay')) {
    LagMethods.setDefaultDelay(settings.defaultDelay);
  }

  if (settings.hasOwnProperty('methods')) {
    LagMethods.setDelaysForMethods(settings.methods);
  }
}

/**
 * The lag-methods configurator.
 * It is exported and may be used for changing the lag settings from the server code of shell
 * @type {Object}
 */
 LagMethods = {
   /**
    * Gets the current default delay
    * @returns {Number} current delay, in ms
    */
   getDefaultDelay: function () {
     return Lag.defaultDelay;
   },
   /**
    * Set the default delay for methods.
    * @example
    * //sets the default delay to 1500 ms
    * Package['alon:lag-methods'].LagMethods.setDefaultDelay(1500);
    * @param  {Number} delay the default delay to set (in ms)
    * @return {Number}       the previous delay value
    */
   setDefaultDelay: function(delay) {
     check(delay, Number);
     var old_delay = Lag.defaultDelay;
     Lag.defaultDelay = delay;
     return old_delay;
   },
   /**
    * Get the delay for a given method name (or the default delay if it is not explicitly set).
    * @param   {String} name the method name
    * @returns {Number}      the delay, in ms
    */
   getDelayForMethod: function (name) {
     return Lag.getDelayForMethod(name);
   },
   /**
    * Set the delays for specific methods.
    * Specify the delays in an object which keys are method names:
    * @example
    * Package['alon:lag-methods'].LagMethods.setDelaysForMethods({
    *   'baz': 1500,
    *   ...
    * });
    * @param {Object} delays  a key-value collection of method names and delays
    * @param {Boolean} replace whether or not to replace currently set delays
    */
   setDelaysForMethods: function(delays, replace) {
     var name;
     if (replace) {
       Lag.clearDelays();
     }
     for (name in delays) if (delays.hasOwnProperty(name)) {
       Lag.addDelay(name, delays[name]);
     }
   }
 };

// Rewrite current registered methods and methods function
Meteor.server.method_handlers = wrapMethods(Meteor.server.method_handlers);

//apply meteor settings, if set
if (Meteor.settings && typeof Meteor.settings.lagMethods === "object") {
  applySettings(Meteor.settings.lagMethods);
}

Meteor.methods = function (methods) {
  return _methods.apply(this, [wrapMethods(methods)]);
};
