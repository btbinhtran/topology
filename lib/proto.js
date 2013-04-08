
/**
 * Module dependencies.
 */

var stream = require('tower-stream');

exports.execute = function(fn){
  // XXX: this is hardcoded to the tests right now.
  // - the last stream emits events to topology.
  // - sort starting from the end finding the inputs.
  var nodes = {}
    , streams = this.constructor.streams
    , self = this
    , closed = {};

  function build(_stream) {
    var node = nodes[_stream.name] = stream(_stream.name).create();
    
    node.outputs = _stream.outputs;
    node.inputs = _stream.inputs;

    if (_stream.outputs.length) {
      node.on('data', function(data){
        node.outputs.forEach(function(next){
          nodes[next].execute(data);
        });
        // next.
        node.execute();
      });

      node.on('close', function(){
        closed[node.name] = true;
        // this isn't correct, the output node
        // should wait until all its inputs are closed first.
        node.outputs.forEach(function(next){
          var allComplete = true;
          nodes[next].inputs.forEach(function(input){
            if (!closed[input.name]) {
              allComplete = false;
              return false;
            }
          });

          if (allComplete)
            nodes[next].close();
        });
      });
    } else {
      node.on('data', function(data){
        self.emit('data', data);
      });

      node.on('close', function(){
        self.emit('close');
      });
    }
  }

  for (var i = 0, n = streams.length; i < n; i++) {
    build(streams[i]);
  }

  // XXX: needs to start the first in the series.
  streams.forEach(function(_stream){
    if (!_stream.inputs.length)
      nodes[_stream.name].execute();
  });

  return this;
}