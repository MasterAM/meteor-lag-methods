/* global ConfigCache:true */

'use strict';

ConfigCache = {
  cacheCollection: function (collection, dict) {
    collection.find({type: 'config'}).observe({
      added: function (attributes) {
        dict.set(attributes.name, attributes.value);
      },
      changed: function (attributes) {
        dict.set(attributes.name, attributes.value);
      }
    });
  }
};