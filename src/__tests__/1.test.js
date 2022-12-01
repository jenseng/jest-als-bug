const { setTimeout } = require("timers/promises");
const { AsyncLocalStorage } = require("async_hooks");

const store = new AsyncLocalStorage();

describe("one", () => {
  beforeEach(async () => {
    store.enterWith("one");
    expect(store.getStore()).toEqual("one");
    await setTimeout(42);
    // so far so good
    expect(store.getStore()).toEqual("one");
  });

  it("the store should still be set", () => {
    // this will usually fail in one of the suites when running both 😬
    expect(store.getStore()).toEqual("one");
  });
});
