
/**
 * DSL `context`.
 */

var context;

/**
 * Push a `tower-stream` by `key`.
 *
 * @param {String} key
 */

exports.node = function(key){
  if (!this.nodes[key]) {
    this.nodes.push(this.nodes[key] = { name: key, inputs: [] });
  }

  context = this.nodes[key];

  return this;
}

/**
 * Map input to parent `node`.
 */

exports.input = function(key){
  context.inputs.push({ name: key });//, fields: slice.call(arguments, 1) });

  return this;
}

exports.create = function(){
  return new this;
}