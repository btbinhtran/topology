var topology = 'undefined' == typeof window
  ? require('..')
  : require('tower-topology'); // how to do this better?

var assert = require('assert');

describe('topology', function(){
  it('should define', function(done){
    topology.on('define', function(s){
      assert('word-counter' === s.id);

      done();
    });

    topology('word-counter');
  });
});
