# Tower Topology

## Installation

node.js:

```bash
npm install tower-topology
```

browser:

```bash
component install tower-topology
```

## Example

```js
var topology = require('tower-topology')
  , node = topology.node;

topology('word-count')
  .node('signals-spout')
  .node('word-normalizer')
  .node('word-counter')
    .input('word-normalizer')
    .input('signals-spout');

node('word-counter')
  .attr('word', 'string')
  .attr('count', 'integer', 0)
  .on('init', function(){})
  .on('execute', function(){})
  .on('close', function(){})
```

Then when it's being used, you can listen for output on the topology:

```js
topology('word-count').on('data', function(data){
  console.log(data.word, data.count);
});
```

## Licence

MIT