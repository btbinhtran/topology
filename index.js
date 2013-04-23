
/**
 * Module dependencies.
 */

var stream = require('tower-stream')
  , proto = require('./lib/proto')
  , statics = require('./lib/static')
  , Emitter = require('tower-emitter');

/**
 * Expose `topology`.
 */

exports = module.exports = topology;

/**
 * Expose `stream` (a `tower-stream` constructor).
 */

exports.stream = stream;

/**
 * Return a `Topology` by `name` (lazily).
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function topology(name) {
  if (lookup[name]) return lookup[name];

  /**
   * Initialize a new `Topology`.
   *
   * @api public
   */

  function Topology() {
    this.name = name;
    this.streams = [];

    Topology.streams.forEach(function(_stream){
      this.stream(_stream.name, _stream);
    }, this);

    this.emit('init', this);
  }

  // statics
  Topology.toString = function toString(){
    return 'topology("' + name + '")';
  }

  Topology.className = Topology.id = name;
  Topology.streams = [];

  for (var key in statics) Topology[key] = statics[key];

  // prototype

  Topology.prototype = {};
  Topology.prototype.constructor = Topology;
  
  for (var key in proto) Topology.prototype[key] = proto[key];

  lookup[name] = Topology;
  constructors.push(Topology);
  topology.emit('define', Topology);

  return Topology;
}

/**
 * Topology classes.
 */

var constructors = topology.constructors = []
  , lookup = {};

/**
 * Mixin `Emitter`.
 */

Emitter(topology);
Emitter(statics);
Emitter(proto);

/**
 * Clear `topology.constructors`.
 */

exports.clear = function(){
  exports.off('define');

  constructors.forEach(function(emitter){
    emitter.off('init');
    emitter.off('data');
    emitter.off('exec');
    emitter.off('close');

    delete lookup[emitter.id];
  });

  constructors.length = 0;
  
  return exports;
}

/**
 * Expose `Topology`.
 */

exports.Topology = topology('default');
