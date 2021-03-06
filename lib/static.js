
/**
 * DSL `context`.
 */

var context;

/**
 * Push a `tower-stream` by `key`.
 *
 * @param {String} key
 */

exports.stream = function(key){
  if (!this.streams[key]) {
    this.streams.push(this.streams[key] = { name: key, inputs: [], outputs: [] });
  }

  context = this.streams[key];

  return this;
}

/**
 * Map input to parent `node`.
 */

exports.input = function(key){
  context.inputs.push({ name: key });//, fields: slice.call(arguments, 1) });
  this.streams[key].outputs.push(context.name);

  return this;
}

exports.create = function(){
  return new this;
}