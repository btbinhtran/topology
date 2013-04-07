var towerTopology = 'undefined' == typeof window
  ? require('..')
  : require('tower-topology'); // how to do this better?

var assert = require('assert');

describe('towerTopology', function(){
  it('should test', function(){
    assert.equal(1 + 1, 2);
  });
});
