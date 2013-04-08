
/**
 * Module dependencies.
 */

var stream = require('tower-stream')
  , series = require('part-async-series');

exports.execute = function(fn){
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
      var fns = [];
      
      node.outputs.forEach(function(next){
        fns.push(function(data, fn){
          nodes[next].execute(data, fn);
        });
      });

      fns.push(function(data, fn){
        node.execute();
      });

      node.on('data', function(data){
        //fns.forEach(function(fn){
        //  fn(data);
        //});
        series(fns, data);
      });

      node.on('close', function(){
        closed[node.name] = true;
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

  // needs to start the first in the series.
  streams.forEach(function(_stream){
    if (!_stream.inputs.length)
      nodes[_stream.name].execute();
  });

  return this;
}