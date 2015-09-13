/* global Lag:true */
/* global lagCollection:true */

'use strict';

Lag = {
  /**
   * The default name for the Mongo collection
   */
  collectionName: 'alon_lag_methods',
  defaultConfigs: {
    "disable": false,
    "persist": false,
    "defaultDelay": 2000,
    "methods": {},
    "usePredefinedExcludes": true,
    "exclude": [],
    "log": false,
    "unblock": true
  },
  currentConfig: new ReactiveDict(),
  basicConfigNames: [
    'disable',
    'persist',
    'defaultDelay',
    'usePredefinedExcludes',
    'log',
    'unblock'
  ],
  lagCollectionName:'lag_method_lag',
  /**
   * Wrap a method with a delayed version.
   * @param  {String}   name of the method
   * @param  {Function} fn   the method handler (as passed to Meteor.method)
   * @return {Function}      The wrapped function
   */
  wrapMethod: function(name, fn) {
    methodCollection.insert({name: name});
    return function() {
      var delay = Lag.getDelayForMethod(name);

      if (Lag.getConfigOption('log')) {
        console.log('[alon:lag-methods] (delay: %d ms) method: %s', delay, name);
      }

      if (delay > 0) {
        if (Lag.getConfigOption('unblock')) {
          this.unblock();
        }
        Meteor._sleepForMs(delay);
      }
      return fn.apply(this, arguments);
    }
  },
  /**
   * A convenience method for generating a list of wrapped methods out of an existing one.
   * @param  {Object} methods a dictionary of methods
   * @return {Object}         a dictionary of wrapped methods
   */
  wrapMethods: function(methods) {
    var name;

    for (name in methods) if (methods.hasOwnProperty(name)) {
      methods[name] = this.wrapMethod(name, methods[name]);
    }

    return methods;
  },
  /**
   * Get the delay for a given method name. If no delay is set, returns the default delay.
   * @param  {String} name the method name
   * @return {Number}      the delay for the given method
   */
  getDelayForMethod: function(name) {
    var method, delay, isDisabled;

    isDisabled = this.getConfigOption('disable');

    if (isDisabled) {
      return 0;
    }

    delay = this.getConfigOption('defaultDelay');

    method = lagCollection.findOne({type: 'method', name: name});
    if (method) {
      if (method.isExcluded) {
        delay = 0;
      } else if ("number" == typeof method.delay) {
        delay = method.delay;
      }
    }
    return delay;
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
    lagCollection.upsert({type: 'method', name: name}, {$set: {delay: delay}});
  },
  /**
   * Clears any delay for a given method name.
   * @param {String} name  method name
   */
  clearDelay: function(name) {
    check(name, String);
    lagCollection.upsert({type: 'method', name: name}, {$unset: {delay: 1}});
  },
  excludeMethod: function(name, doExclude) {
    lagCollection.upsert({type: 'method', name: name}, {$set: {isExcluded: doExclude}});
  },
  setInitialized: function () {
    lagCollection.upsert({type: 'state', name: 'initialized'}, {$set: {value: true}});
  },
  initConfig: function(){
    //apply meteor settings, if set
    var configs = {};
    var actualCollectionName = null;

    if (Meteor.settings && typeof Meteor.settings.lagMethods === "object") {
      configs = Meteor.settings.lagMethods;
    }

    configs = this.applyDefaults(configs);

    //set default config values in the dict
    this.initializeDict(configs);
    if (configs.persist) {
      actualCollectionName = this.lagCollectionName;
    }

    lagCollection = new Mongo.Collection(actualCollectionName);

    if (!configs.persist || !this.isInitialized()) {
      // only apply settings if not persistent or if this is the first time a persistent state is set
      this.applySettings(configs);
    } else if (configs.disabled) {
      // or if disabled
      this.applySettings({disabled: true});
    }
    this.setInitialized();
  },
  isInitialized: function() {
    return !!lagCollection.findOne({type: 'state', name: 'initialized', value:true});
  },
  /**
   * Initializes the configuration dictionary with the basic configuration options
   * @param configs
   */
  initializeDict: function (configs) {
    var self = this;
    _.each(this.basicConfigNames, function (name) {
      self.currentConfig.setDefault(name, configs[name]);
    });
  },
  /**
   * convenience method for processing the data from a json settings file.
   * @param  {Object} config configuration options
   * @return {[type]}          [description]
   */
  applySettings: function (config) {
    //set simple properties.
    var self = this;
    _.each(this.basicConfigNames, function(propName) {
      if (config.hasOwnProperty(propName)) {
        lagCollection.upsert({type: 'config', name: propName}, {$set: {value: config[propName]}});
      }
    });

    if (config.hasOwnProperty('exclude')) {
      // include all existing methods
      lagCollection.update({type: 'method'}, {$set:{excluded: false}}, {multi: true});
      //and exclude selected
      _.each(config.exclude, function (methodName) {
        self.excludeMethod(methodName, true);
      });
    }
    if (config.hasOwnProperty('methods')) {
      //unset all delays
      lagCollection.update({type: 'method'}, {$unset: {delay: 1}}, {multi: true});
      //and set only the relevant ones
      _.each(config.methods, function (delay, methodName) {
        self.addDelay(methodName, delay);
      });
    }
  },
  /**
   * Get the value of one of the configuration options.
   * @param {String} optionName the name of the configuration option
   * @returns {*}    the current value associated with the option
   */
  getConfigOption: function(optionName) {
    var record;
    if (_.contains(this.basicConfigNames, optionName)) {
      return this.currentConfig.get(optionName);
    }
    record = lagCollection.findOne({type: 'config', name: optionName});
    if (record) {
      return record.value;
    }
    console.warn('lag-methods: attempted tp get an option that was not set: ', optionName);
    return this.defaultConfigs[optionName];
  },
  /**
   * Apply defaults to the config object.
   * @param {Object} config the config object to extend
   * @returns {Object}      the extended config object
   */
  applyDefaults: function(config) {

    //add default configuration options
    config = _.extend(
      _.omit(this.defaultConfigs, ['exclude']),
      config
    );

    //merge excludes
    if (config.usePredefinedExcludes) {
      config.exclude = _.union(config.exclude || [], this.defaultConfigs.exclude);
    }

    return config;
  }
};

