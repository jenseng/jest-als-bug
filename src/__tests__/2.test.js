const { setTimeout } = require("timers/promises");
const { AsyncLocalStorage } = require("async_hooks");

const store = new AsyncLocalStorage();

describe("two", () => {
  beforeEach(async () => {
    store.enterWith("two");
    expect(store.getStore()).toEqual("two");
    await setTimeout(42);
    // so far so good
    expect(store.getStore()).toEqual("two");
  });

  it("the store should still be set", () => {
    // this will usually fail in one of the suites when running both 😬
    expect(store.getStore()).toEqual("two");
  });
});
