import EasyInterval from "./easyinterval";

export const createIntervalAction = payload => {
  return {
    type: "INTERVAL",
    payload
  };
};
const createIntervalMiddleware = extraArgument => {
  return ({ dispatch, getState }) => next => action => {
    if (action.type === "INTERVAL") {
      const { name, time, callback, runNow, command } = action.payload;
      if (command === "start") {
        if (!EasyInterval.existData(name)) {
          EasyInterval.add(name, () => callback(dispatch, getState, extraArgument), time);
        }
        if (runNow && EasyInterval.getCallerCount(name) === 0) {
          EasyInterval.call(name);
        }
        EasyInterval.start(name);
      } else if (EasyInterval.existData(name) && command === "stop") {
        EasyInterval.stop(name);
      } else if (EasyInterval.existData(name) && command === "call") {
        EasyInterval.call(name);
      } else if (command === "stopAll") {
        EasyInterval.stopAll();
      }
    }
    return next(action);
  };
};
const Interval = createIntervalMiddleware();
Interval.withExtraArgument = createIntervalMiddleware;

export default Interval;
