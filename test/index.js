var topology = 'undefined' == typeof window
  ? require('..')
  : require('tower-topology'); // how to do this better?

var assert = require('assert');

describe('topology', function(){
  beforeEach(topology.clear);

  it('should define', function(done){
    topology.on('define', function(s){
      assert('word-count' === s.id);

      done();
    });

    topology('word-count');
  });

  it('should define nodes and inputs', function(){
    topology('word-count')
      .node('signals-spout')
      .node('word-normalizer')
      .node('word-counter')
        .input('word-normalizer')
        .input('signals-spout');

    var nodes = topology('word-count').nodes;

    assert(3 === nodes.length);
    
    assert('signals-spout' === nodes[0].name);
    assert('word-normalizer' === nodes[1].name);
    assert('word-counter' === nodes[2].name);

    assert('word-normalizer' === nodes[2].inputs[0].name);
    assert('signals-spout' === nodes[2].inputs[1].name);
  });
});
