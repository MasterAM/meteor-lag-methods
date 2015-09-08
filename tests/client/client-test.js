Tinytest.addAsync("delay of async method call from the client", function( test, next ) {
  var tStart = new Date().getTime();
  Meteor.call('foo', 1, '1', function(err, data) {
    var dt = new Date().getTime() - tStart;
    test.isTrue(dt >= 1000, 'method call takes more than 1000 ms');
    test.isUndefined(err);
    test.equal(data, true);
    next();
  });
});
