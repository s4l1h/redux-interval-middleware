'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var easyintervals = {
  intervals: {},
  data: {},
  callerCount: {},
  add: function add(key, fn, time) {
    //console.log("add", key);
    if (!this.existData(key)) {
      this.data[key] = {
        key: key,
        fn: fn,
        time: time
      };
    }
  },
  delete: function _delete(key) {
    if (!this.existData(key)) {
      delete this.data[key];
    }
  },
  start: function start(key) {
    //console.log("start ", key);
    if (!this.existData(key)) {
      throw new Error("easyintervals: " + key + " not found pls first add");
    }

    if (!this.existIntervals(key)) {
      this.initalizeInterval(this.data[key]);
    }
  },
  stop: function stop(key) {
    //console.log("stop ", key);
    if (this.existIntervals(key)) {
      this.clear(key);
    }
  },
  stopALL: function stopALL() {
    var _this = this;

    //console.log("Stop ALL");
    Object.keys(this.data).forEach(function (v) {
      _this.stop(v);
    });
  },
  clear: function clear(key) {
    clearInterval(this.intervals[key]);
    delete this.intervals[key];
  },
  initalizeInterval: function initalizeInterval(data) {
    var _this2 = this;

    //console.log("initalizeInterval ", data.key);
    this.intervals[data.key] = setInterval(function () {
      _this2.call(data.key);
    }, data.time * 1000);
  },
  call: function call(key) {
    //console.log("call ", key);
    if (this.existData(key)) {
      var data = this.data[key]; // data.fn()

      this.callMe(key, data.fn);
    }
  },
  callMe: function callMe(key, fn) {
    //console.log("callMe ", key);
    if (typeof this.callerCount[key] === "undefined") {
      this.callerCount[key] = 0;
    }

    this.callerCount[key]++;
    fn();
  },
  getCallerCount: function getCallerCount(key) {
    if (typeof this.callerCount[key] === "undefined") {
      this.callerCount[key] = 0;
    }

    return this.callerCount[key];
  },
  existData: function existData(key) {
    if (typeof this.data[key] !== "undefined") {
      return true;
    }

    return false;
  },
  existIntervals: function existIntervals(key) {
    if (typeof this.intervals[key] !== "undefined") {
      return true;
    }

    return false;
  }
};

var createIntervalAction = function createIntervalAction(payload) {
  return {
    type: "INTERVAL",
    payload: payload
  };
};

var createIntervalMiddleware = function createIntervalMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (action.type === "INTERVAL") {
          var _action$payload = action.payload,
              name = _action$payload.name,
              time = _action$payload.time,
              callback = _action$payload.callback,
              runNow = _action$payload.runNow,
              command = _action$payload.command;

          if (command === "start") {
            if (!easyintervals.existData(name)) {
              easyintervals.add(name, function () {
                return callback(dispatch, getState, extraArgument);
              }, time);
            }

            if (runNow && easyintervals.getCallerCount(name) === 0) {
              easyintervals.call(name);
            }

            easyintervals.start(name);
          } else if (easyintervals.existData(name) && command === "stop") {
            easyintervals.stop(name);
          } else if (easyintervals.existData(name) && command === "call") {
            easyintervals.call(name);
          } else if (command === "stopAll") {
            easyintervals.stopAll();
          }
        }

        return next(action);
      };
    };
  };
};

var Interval = createIntervalMiddleware();
Interval.withExtraArgument = createIntervalMiddleware;

exports.createIntervalAction = createIntervalAction;
exports.default = Interval;
