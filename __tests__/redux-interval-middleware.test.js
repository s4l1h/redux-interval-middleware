import intervalMiddleware from "../src/index";

const create = (middleware = intervalMiddleware) => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  };
  const next = jest.fn();

  const invoke = action => middleware(store)(next)(action);

  return { store, next, invoke };
};

describe("middleware", () => {
  const start_action = {
    type: "INTERVAL",
    payload: {
      name: "fetch",
      runNow: true,
      time: 60,
      command: "start",
      callback: (dispatch, getStore) => {}
    }
  };

  it("calls the function", () => {
    const { invoke, next } = create();
    const fn = jest.fn();
    fn.mockReturnValue(start_action);
    invoke(fn());
    expect(fn).toHaveBeenCalled();
  });
  it("calls the object", () => {
    const { invoke, next } = create();
    invoke(start_action);
    expect(next).toHaveBeenCalledWith(start_action);
  });

  it("it has to be called if it has runNow in payload", () => {
    const { invoke } = create();
    const callbackFN = jest.fn();

    const runNow = {
      type: "INTERVAL",
      payload: {
        name: "runNow",
        runNow: true,
        time: 60,
        command: "start",
        callback: (dispatch, getStore) => {
          callbackFN();
        }
      }
    };

    invoke(runNow);
    expect(callbackFN).toHaveBeenCalled();
    expect(callbackFN.mock.calls.length).toBe(1);
  });

  it("it shouldn't be called immediately", () => {
    const { invoke } = create();
    const callbackFN = jest.fn();

    const runNow = {
      type: "INTERVAL",
      payload: {
        name: "immediately",
        runNow: false,
        time: 60,
        command: "start",
        callback: (dispatch, getStore) => {
          callbackFN();
        }
      }
    };
    invoke(runNow);
    expect(callbackFN).not.toHaveBeenCalled();
    expect(callbackFN.mock.calls.length).toBe(0);
  });

  it("dispatch and getState should be accessible in the callback function", () => {
    const { store, invoke } = create();
    const action = {
      type: "INTERVAL",
      payload: {
        name: "testDispatchAndGetStore",
        runNow: true,
        time: 60,
        command: "start",
        callback: (dispatch, getStore) => {
          dispatch("TEST DISPATCH");
          getStore();
        }
      }
    };
    invoke(action);
    expect(store.dispatch).toHaveBeenCalledWith("TEST DISPATCH");
    expect(store.getState).toHaveBeenCalled();
  });

  it("extra args should be accessible in the callback function", () => {
    const middleware = intervalMiddleware.withExtraArgument({
      baseURL: "FOO",
      API_KEY: "KEY"
    });

    const { invoke } = create(middleware);

    const action = {
      type: "INTERVAL",
      payload: {
        name: "extraARG",
        runNow: true,
        time: 60,
        command: "start",
        callback: (dispatch, getStore, extraArgument) => {
          expect(extraArgument.baseURL).toBe("FOO");
          expect(extraArgument.API_KEY).toBe("KEY");
        }
      }
    };
    invoke(action);
  });

  it("it should be called via call command", () => {
    const { invoke } = create();
    const callbackFN = jest.fn();

    const runNow = {
      type: "INTERVAL",
      payload: {
        name: "viaCallCommand",
        runNow: false,
        time: 60,
        command: "start",
        callback: (dispatch, getStore) => {
          callbackFN();
        }
      }
    };
    invoke(runNow);

    // Now We can call it manual
    invoke({
      type: "INTERVAL",
      payload: {
        name: "viaCallCommand",
        command: "call"
      }
    });
    expect(callbackFN).toHaveBeenCalled();

    invoke({
      type: "INTERVAL",
      payload: {
        name: "viaCallCommand",
        command: "call"
      }
    });

    expect(callbackFN.mock.calls.length).toBe(2);
  });
});
