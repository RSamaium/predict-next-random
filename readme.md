# Random Number Predictor

A TypeScript library that predicts the next `Math.random()` number in V8 JavaScript engine (Chrome, Node.js, Edge, etc.).

## Importants Notes

This predictor only works with the V8 JavaScript engine as it specifically targets its xoshiro128+ PRNG implementation. It will not work with other JavaScript engines like SpiderMonkey (Firefox) or JavaScriptCore (Safari).

In addition, to use it in the browser, the browser must accept `SharedArrayBuffer`

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements

## Installation

```bash
npm install predict-next-random
```

> To use the library in the browser, you can use the CDN version:
> `<script src="https://unpkg.com/predict-next-random@latest/dist/index.global.js"></script>`
> and use the `predictNextRandom` global variable.

## Usage

The `predictNextRandom` function accepts an array of random numbers and predicts the next one in the sequence:

```typescript
import predictNextRandom from 'predict-next-random';

// Using default sequence (automatically generates 5 random numbers)
const prediction = await predictNextRandom();
console.log('Next random number will be:', prediction);

// Using custom sequence (must be 5 consecutive Math.random() numbers)
const customSequence = [
    0.7242371475558931,
    0.3586243644569792,
    0.4281750074487711,
    0.9687851683730692,
    0.2347827331634612
];
const customPrediction = await predictNextRandom(customSequence);
console.log('Next random number will be:', customPrediction);
```

### Requirements

- Must be run in a V8 JavaScript engine (Node.js, Chrome, Edge, etc.)
- Sequence must contain 5 consecutive Math.random() numbers
- Numbers must be in the exact order they were generated

### Return Value

- Returns a `Promise` that resolves to:
  - The predicted next random number (between 0 and 1)
  - `null` if prediction fails