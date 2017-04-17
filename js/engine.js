const engine = {
  isRunning: false,
  requestTick: false,
  create(callback = () => {}) {
    const eng = Object.create(engine);
    eng.cb = callback;
    return eng;
  },
  callback() {
    this.cb();
    this.requestTick = true;
    this.loop();
  },
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.requestTick = true;
      this.loop();
    }
  },
  stop() {
    this.isRunning = false;
    this.requestTick = false;
  },
  loop() {
    if (this.requestTick && this.isRunning) {
      this.requestTick = false;
      requestAnimationFrame(this.callback.bind(this));
    }
  }
};

export default engine;
