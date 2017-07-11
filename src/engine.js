class Engine {
  /**
   * Create an Engine object.
   * @param {!Function} callback
   */
  constructor(callback = () => {}) {
    this.cb = callback;
    this.requestTick = false;
    this.isRunning = false;
    this.callback = this.callback.bind(this);
  }

  /**
   * Call user callback and loop again.
   */
  callback() {
    this.cb();
    this.requestTick = true;
    this.loop();
  }

  /**
   * Run requestAnimationFrame against the user callback.
   */
  loop() {
    if (this.requestTick && this.isRunning) {
      this.requestTick = false;
      requestAnimationFrame(this.callback);
    }
  }

  /**
   * Start the requestAnimationFrame loop.
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.requestTick = true;
      this.loop();
    }
  }

  /**
   * Stop the requestAnimationFrame loop.
   */
  stop() {
    this.isRunning = false;
    this.requestTick = false;
  }
}

export default Engine;
