Meteor.methods({
  'foo': function(intArg, stringVar) {
    check(intArg, Number);
    check(stringVar, String);
    return true;
  },
  'bar': function(intArg, stringVar) {
    check(intArg, Number);
    check(stringVar, String);
    return true;
  },
  'baz': function(intArg, stringVar) {
    check(intArg, Number);
    check(stringVar, String);
    return true;
  }
});
//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equal(actual, expected, message, not)
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)
//test.equal(a, b, msg)

function callSync(name, delay, test) {
  var tStart = new Date().getTime();
  var result = Meteor.call('foo', 1, '1');
  var dt = new Date().getTime() - tStart;
  test.isTrue(dt >= delay, name + ' method call should take more than ' + delay + ' ms');
  test.equal(result, true, 'return value is as expected');
}

Tinytest.add('make sure that the configurator is available', function(test) {
  test.isTrue(typeof Package['alon:lag-methods'].LagMethods === 'object', 'the configurator is available');
});

Tinytest.add("default delay on sync server calls", function(test) {
  callSync('foo', 2000, test);
  callSync('bar', 2000, test);
  callSync('baz', 2000, test);
});


Tinytest.add("modified delay on sync server calls", function(test) {
  Package['alon:lag-methods'].LagMethods.setDefaultDelay(lagDefault);
  callSync('foo', lagDefault, test);
  callSync('bar', lagDefault, test);
  callSync('baz', lagDefault, test);
});

Tinytest.add("per-method delay on sync server calls", function(test) {
  Package['alon:lag-methods'].LagMethods.setDelaysForMethods(lagConfig);
  callSync('foo', lagConfig.foo, test);
  callSync('bar', lagConfig.bar, test);
  callSync('baz', lagDefault, test);
});
