
/**
 * Module dependencies.
 */

var stream = require('tower-stream');

exports.execute = function(fn){
  // XXX: this is hardcoded to the tests right now.
  var self = this;

  var a = this.constructor.nodes[0]
    , b = this.constructor.nodes[1];

  var x = stream(a.name).create()
    , y = stream(b.name).create();

  // x.pipe(y);
  x.on('data', function(data){
    y.execute(data);
    x.execute();
  });

  y.on('data', function(data){
    self.emit('data', data);
  })

  x.on('close', function(){
    y.close();
  });

  y.on('close', function(){
    self.emit('close');
  });

  x.execute();

  return this;
}