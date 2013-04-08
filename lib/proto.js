
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
    , self = this;

  function build(_stream) {
    var node = nodes[_stream.name] = stream(_stream.name).create();
    
    if (_stream.outputs.length) {
      node.outputs = _stream.outputs;
      node.on('data', function(data){
        node.outputs.forEach(function(next){
          nodes[next].execute(data);
        });
        // next.
        node.execute();
      });

      node.on('close', function(){
        // this isn't correct, the output node
        // should wait until all its inputs are closed first.
        node.outputs.forEach(function(next){
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
  nodes[streams[0].name].execute();

  return this;
}