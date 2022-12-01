# Jest AsyncLocalStorage bug repro

This repo contains a simple Jest bug repro around [AsyncLocalStorage](https://nodejs.org/api/async_context.html) context loss. When the test files are run individually, they pass. When they run together, one typically fails due to context loss. This happens regardless of settings like `runInBand` or `maxWorkers` (though in a real app's test suite it's much worse with `maxWorkers`).

The tests in question set a store using `enterWith` during `beforeEach`, and later retrieve it in tests via `getStore`. It's possible this is actually a bug in Node.js, or it might have to do with some strange interplay between Node.js's promise hooks and Jest's vm context injection (e.g. perhaps the `Promise` provided to the VM is not the "right" one, and thus the hooks don't work correctly when it is used?).

I have thus far been unable to repro this issue outside of Jest with [roughly equivalent code](./src/repro-attempt-without-jest.js); I haven't dug deeply enough into Jest to determine where the problem lies.

## Repro Steps

1. Run `npm run test`
2. Observe that one of the tests usually fails

## Versions tested

- **Jest**: 29.3.1, 27.5.1
- **Node.js**: 18.12.1, 16.16.0

## Possibly related issues

- https://github.com/facebook/jest/issues/11435
- https://github.com/nodejs/node/issues/38781
