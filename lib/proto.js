
/**
 * Module dependencies.
 */

var stream = require('tower-stream')
  , series = require('part-async-series');

/**
 * DSL for building a stream on an instance.
 */

exports.stream = function(obj, options){
  if ('string' == typeof obj)
    obj = this.streams[obj] = stream(obj).create(options);
  else
    this.streams[obj.name] = obj;

  this.streams.push(obj);

  return this;
}

exports.execute = function(fn){
  // - the last stream emits events to topology.
  // - sort starting from the end finding the inputs.
  var streams = this.streams
    , self = this
    , closed = {};

  function build(node) {
    if (node.outputs.length) {
      var fns = [];
      
      node.outputs.forEach(function(next){
        fns.push(function(data, fn){
          streams[next].execute(data, fn);
          // this fixes it?
          // fn();
        });
      });

      // after all "next" nodes have received the data,
      // then execute the current node again.
      fns.push(function(data, fn){
        node.execute(data, fn);
      });

      node.on('data', function(data){
        series(fns, data);
      });

      node.on('close', function(){
        closed[node.name] = true;
        // should wait until all its inputs are closed first.
        node.outputs.forEach(function(next){
          var allComplete = true;
          streams[next].inputs.forEach(function(input){
            if (!closed[input.name]) {
              allComplete = false;
              return false;
            }
          });

          if (allComplete)
            streams[next].close();
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

  streams.forEach(build);

  // needs to start the first in the series.
  streams.forEach(function(_stream){
    if (!_stream.inputs.length)
      streams[_stream.name].execute();
  });

  return this;
}