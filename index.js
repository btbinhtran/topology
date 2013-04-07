
/**
 * Module dependencies.
 */

var stream = require('stream')
  , context;

/**
 * Expose `topology`.
 */

var exports = module.exports = topology;

/**
 * Expose `Topology`.
 */

exports.Topology = Topology;

/**
 * Expose `Node`.
 */

exports.Node = Node;

/**
 * A one-liner.
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function topology(name) {
  if (topology[name]) return topology[name];

  return topology[name] = new Topology;
}

function Topology() {

}

Topology.node = function(){

}

Topology.input = function(name){

}

function Node() {

}

