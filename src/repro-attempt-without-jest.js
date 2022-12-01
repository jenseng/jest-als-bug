const { AsyncLocalStorage } = require("async_hooks");
const vm = require("vm");

// Try to emulate what Jest is doing to see if this is actually a Node.js bug.
// So far I can't get it to fail, so there must be more happening within the Jest code paths 🤷‍♂️

let testContext = new AsyncLocalStorage();
function describe(suite, cb) {
  testContext.run({ suite }, cb);
}

function beforeEach(cb) {
  testContext.getStore().beforeEach = cb;
}

function it(test, cb) {
  const { beforeEach, suite } = testContext.getStore();
  Promise.resolve(beforeEach())
    .then(() => Promise.resolve()) // add more Promises to the mix, like jest-circus does 😅
    .then(() =>
      Promise.resolve(cb())
        .then(() => console.log(`PASS: ${suite} > ${test}`))
        .catch((e) => {
          console.error(`FAIL: ${suite} > ${test}: ${e.message}`);
        })
    );
}

function expect(value) {
  return {
    toEqual(expected) {
      if (value != expected)
        throw new Error(
          `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(value)}`
        );
    },
  };
}

function emulateJest(test) {
  vm.runInContext(
    `
    const { setTimeout } = require("timers/promises");
    const { AsyncLocalStorage } = require("async_hooks");
    
    const store = new AsyncLocalStorage();
    
    describe("${test}", () => {
      beforeEach(async () => {
        store.enterWith("${test}");
        expect(store.getStore()).toEqual("${test}");
        await setTimeout(42);
        expect(store.getStore()).toEqual("${test}");
      });
    
      it("the store should still be set", () => {
        expect(store.getStore()).toEqual("${test}");
      });
    });
  `,
    vm.createContext({ it, beforeEach, describe, expect, require })
  );
}
emulateJest("one");
emulateJest("two");
