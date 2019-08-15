const easyintervals = {
  intervals: {},
  data: {},
  callerCount: {},
  add(key, fn, time) {
    //console.log("add", key);
    if (!this.existData(key)) {
      this.data[key] = {
        key: key,
        fn: fn,
        time: time
      };
    }
  },
  delete(key) {
    if (!this.existData(key)) {
      delete this.data[key];
    }
  },
  start(key) {
    //console.log("start ", key);
    if (!this.existData(key)) {
      throw new Error("easyintervals: " + key + " not found pls first add");
    }
    if (!this.existIntervals(key)) {
      this.initalizeInterval(this.data[key]);
    }
  },
  stop(key) {
    //console.log("stop ", key);
    if (this.existIntervals(key)) {
      this.clear(key);
    }
  },
  stopALL() {
    //console.log("Stop ALL");
    Object.keys(this.data).forEach(v => {
      this.stop(v);
    });
  },
  clear(key) {
    clearInterval(this.intervals[key]);
    delete this.intervals[key];
  },
  initalizeInterval(data) {
    //console.log("initalizeInterval ", data.key);
    this.intervals[data.key] = setInterval(() => {
      this.call(data.key);
    }, data.time * 1000);
  },
  call(key) {
    //console.log("call ", key);
    if (this.existData(key)) {
      let data = this.data[key];
      // data.fn()
      this.callMe(key, data.fn);
    }
  },
  callMe(key, fn) {
    //console.log("callMe ", key);
    if (typeof this.callerCount[key] === "undefined") {
      this.callerCount[key] = 0;
    }
    this.callerCount[key]++;
    fn();
  },
  getCallerCount(key) {
    if (typeof this.callerCount[key] === "undefined") {
      this.callerCount[key] = 0;
    }
    return this.callerCount[key];
  },
  existData(key) {
    if (typeof this.data[key] !== "undefined") {
      return true;
    }
    return false;
  },
  existIntervals(key) {
    if (typeof this.intervals[key] !== "undefined") {
      return true;
    }
    return false;
  }
};
export default easyintervals;
