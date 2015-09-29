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
var api = Package['alon:lag-base'].API;
function callSync(name, delay, test) {
  var tStart = new Date().getTime();
  var result = Meteor.call(name, 1, '1');
  var dt = new Date().getTime() - tStart;
  test.isTrue(dt >= delay, name + ' method call should take more than ' + delay + ' ms');
  test.equal(result, true, 'return value is as expected');
}

Tinytest.add('make sure that the configurator is available', function(test) {
  test.isTrue(typeof Package['alon:lag-methods'].methodConfigurator === 'object', 'the configurator is available');
});

Tinytest.add("default delay on sync server calls", function(test) {
  var defaultDelay = api.getDefaultDelay();
  callSync('foo', defaultDelay, test);
  callSync('bar', defaultDelay, test);
  callSync('baz', defaultDelay, test);
});


Tinytest.add("modified delay on sync server calls", function(test) {
  api.setDefaultDelay(newDefaultDelay);
  callSync('foo', newDefaultDelay, test);
  callSync('bar', newDefaultDelay, test);
  callSync('baz', newDefaultDelay, test);
});

Tinytest.add("per-method delay on sync server calls", function(test) {
  api.setDelaysFor('method', customDelays);
  callSync('foo', customDelays.foo, test);
  callSync('bar', customDelays.bar, test);
  callSync('baz', newDefaultDelay, test);
});
