
/**
 * Module dependencies.
 */

var stream = require('tower-stream')
  , proto = require('./lib/proto')
  , statics = require('./lib/static')
  , Emitter = 'undefined' == typeof window ? require('emitter-component') : require('emitter')

/**
 * Expose `topology`.
 */

module.exports = topology;

/**
 * Expose `node` (a `tower-stream` constructor).
 */

module.exports.node = stream;

/**
 * Return a `Topology` by `name` (lazily).
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function topology(name) {
  if (constructors[name]) return constructors[name];

  /**
   * Initialize a new `Topology`.
   *
   * @api public
   */

  function Topology() {
    this.name = name;
    this.emit('init', this);
  }

  // mixin emitter

  Emitter(Topology);

  // statics

  Topology.className = Topology.id = name;

  for (var key in statics) Topology[key] = statics[key];

  // prototype

  Topology.prototype = {};
  Topology.prototype.constructor = Topology;
  Emitter(Topology.prototype);
  
  for (var key in proto) Topology.prototype[key] = proto[key];

  constructors[name] = Topology;
  constructors.push(Topology);

  topology.emit('define', Topology);

  return Topology;
}

/**
 * Topology classes.
 */

var constructors = topology.constructors = [];

/**
 * Mixin `Emitter`.
 */

Emitter(topology);