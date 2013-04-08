var topology = 'undefined' == typeof window
  ? require('..')
  : require('tower-topology'); // how to do this better?

var assert = require('assert')
  , stream = require('tower-stream');

describe('topology', function(){
  beforeEach(topology.clear);

  it('should define', function(done){
    topology.on('define', function(s){
      assert('word-count' === s.id);

      done();
    });

    topology('word-count');
  });

  it('should define streams and inputs', function(){
    topology('word-count')
      .stream('signals-spout')
      .stream('word-normalizer')
      .stream('word-counter')
        .input('word-normalizer')
        .input('signals-spout');

    var streams = topology('word-count').streams;

    assert(3 === streams.length);
    
    assert('signals-spout' === streams[0].name);
    assert('word-normalizer' === streams[1].name);
    assert('word-counter' === streams[2].name);

    assert('word-normalizer' === streams[2].inputs[0].name);
    assert('signals-spout' === streams[2].inputs[1].name);
  });

  it('should execute', function(done){
    // a
    stream('word-emitter')
      .on('init', function(node){
        node.words = [
            'hello'
          , 'hello'
          , 'hello'
          , 'hello'
          , 'hello'
          , 'world'
          , 'world'
        ];
      })
      .on('execute', function(node, data){
        if (node.words.length)
          node.emit('data', { word: node.words.shift() });
        else
          node.close();
      });

    // b
    stream('word-counter')
      .on('init', function(node){
        node.words = {};
      })
      .on('execute', function(node, data){
        null == node.words[data.word]
          ? node.words[data.word] = 1
          : ++node.words[data.word];

        node.emit('data', {
            word: data.word
          , count: node.words[data.word]
        });
      });

    // topology
    topology('word-count')
      .stream('word-emitter')
      .stream('word-counter')
        .input('word-emitter');

    // this will happen internally
    var count = topology('word-count').create()
      , counts = [];

    // test
    count
      .on('data', function(data){
        counts.push(data);
      })
      .on('close', function(){
        assert(7 === counts.length);

        assert('hello' === counts[0].word);
        assert(1 === counts[0].count);
        assert('hello' === counts[4].word);
        assert(5 === counts[4].count);

        assert('world' === counts[5].word);
        assert(1 === counts[5].count);
        assert('world' === counts[6].word);
        assert(2 === counts[6].count);

        done();
      }).execute();
  });
});
