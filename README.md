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
  .on('init', function(){})
  .on('execute', function(){})
  .on('close', function(){})
```

## Licence

MIT