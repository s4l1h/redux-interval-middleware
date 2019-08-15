import Interval from "../src/easyinterval";
describe("Basic", () => {
  const callbackFN = jest.fn();
  Interval.add("test", callbackFN, 50);
  Interval.call("test");

  test("it should be called.", () => {
    expect(callbackFN).toBeCalled();
  });

  test("it should be called ones", () => {
    expect(callbackFN).toHaveBeenCalledTimes(1);
  });

  test("it should data exists", () => {
    expect(Interval.existData("test")).toBeTruthy();
  });

  test("Callback function's called count has to be equal getCallerCount.", () => {
    expect(Interval.getCallerCount("test")).toBe(callbackFN.mock.calls.length);
  });

  test("it should be stoped.", () => {
    Interval.stop("test");
    expect(Interval.existIntervals("test")).toBeFalsy();
  });
});
