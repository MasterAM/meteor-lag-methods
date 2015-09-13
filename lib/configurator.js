/* global LagMethods:true */

'use strict';

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
   * LagMethods.setDefaultDelay(1500);
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
  getDelayForMethod: function(name) {
    return Lag.getDelayForMethod(name);
  },
  /**
   * Set the delays for specific methods.
   * Specify the delays in an object which keys are method names:
   * @example
   * LagMethods.setDelaysForMethods({
    *   'baz': 1500,
    *   ...
    * });
   * @param {Object}  delays  a key-value collection of method names and delays
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
  },
  /**
   * Set the delays for specific methods.
   * Specify the delays in an object which keys are method names:
   * @example
   * // prevent delay for methods 'foo' and 'bar'
   * LagMethods.setExcludeForMethods([
   *   'foo',
   *   'bar'
   * ], true);
   * @param {Array}   names     an array of method names
   * @param {Boolean} doExclude whether or not to replace exclude given methods
   */
  setExcludeForMethods: function(names, doExclude) {
    _.each(names, function(name) {
      Lag.excludeMethod(name, doExclude);
    });
  },
  /**
   * Sets the config options to those specified.
   * @param {Object} configs a configuration object, as the one in the json config file
   */
  setConfigOptions: function(configs) {
    Lag.applySettings(configs);
  },
  /**
   * Resets the configuration options to the defaults.
   * Use with care, as it is not entirely safe.
   */
  resetConfigOptions: function () {
    Lag.initConfig();
  },
  _getLagCollection: function () {
    return lagCollection;
  },
  _getMethodCollection: function () {
    return methodCollection;
  }
};
