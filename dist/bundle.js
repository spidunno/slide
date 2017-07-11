/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__engine__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(3);




const KEY = {
  up: 40,
  down: 38,
  left: 37,
  right: 39,
};

const DIRECTION = {
  vertical: 'vertical',
  horizontal: 'horizontal'
};

class Slide {
  /**
   * Creates a slide object.
   * @param {!HTMLElement} element
   */
  constructor(element, options = {}) {
    this.element = element;
    this.slideWrapper = element.querySelector('.js-content');
    this.defaultOptions = {
      direction: DIRECTION.vertical,
      friction: 0.96,
      touch: false,
      mouse: true,
      keyboard: false
    };

    this.options = Object.assign({}, this.defaultOptions, options);
    this.friction = this.options.friction;
    this.previousPosition = 0;
    this.previousPositions = [];
    this.isDragging = false;
    this.deltaAmount = 0;

    this.positionVector = new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */]();
    this.velocityVector = new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */]();
    this.accelerationVector = new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */]();

    this.update = this.update.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.tap = this.tap.bind(this);
    this.drag = this.drag.bind(this);
    this.release = this.release.bind(this);

    this.accelerate = false;
    this.animationLoop = new __WEBPACK_IMPORTED_MODULE_0__engine__["a" /* default */](this.update);
    this.max = this.calculateMax(this.element, this.slideWrapper);

    this.addEvents();
  }

  /**
   * Setup all touch and mouse events.
   */
  addEvents() {
    this.element.addEventListener('mouseenter', this.onMouseEnter);
    this.element.addEventListener('mouseleave', this.onMouseLeave);

    if (this.options.mouse) {
      this.element.addEventListener('mousedown', this.tap);
    }

    if (this.options.touch && this.isTouch()) {
      this.element.addEventListener('touchstart', this.tap);
    }

    window.addEventListener('resize', this.onResize);
  }

  /**
   * Update is continuously called when our 'engine' is running.
   * Velocity is added to position to move our slide container.
   */
  update() {
    this.calculateVelocity();
    this.positionVector.addTo(this.velocityVector);

    if (this.options.direction === DIRECTION.vertical) {
      if (this.positionVector.getY() > 0) {
        this.positionVector.setY(0);
        this.velocityVector.setY(0);
      }

      if (this.positionVector.getY() < -(this.max)) {
        this.positionVector.setY(-this.max);
        this.velocityVector.setY(0);
      }

      if (this.shouldStop(this.velocityVector.getY())) {
        this.animationLoop.stop();
      }
    } else {
      if (this.positionVector.getX() > 0) {
        this.positionVector.setX(0);
        this.velocityVector.setX(0);
      }

      if (Math.abs(this.positionVector.getX()) > this.max) {
        this.positionVector.setX(-this.max);
        this.velocityVector.setX(0);
      }

      if (this.shouldStop(this.velocityVector.getX())) {
        this.animationLoop.stop();
      }
    }

    this.render();
  }

  /**
   * A velocity is calculated with either accerlation or friction.
   */
  calculateVelocity() {
    if (this.isDragging) {
      if (this.options.direction === DIRECTION.vertical) {
        this.velocityVector.setY(-this.deltaAmount);
      } else {
        this.velocityVector.setX(-this.deltaAmount);
      }
      return;
    }

    if (this.accelerate) {
      this.velocityVector.addTo(this.accelerationVector);
    } else {
      this.velocityVector.multiplyBy(this.friction);
    }
  }

  /**
   * @param {number} amount
   * @return {boolean}
   */
  shouldStop(velocityAmount) {
    return velocityAmount <= 0.1 && velocityAmount >= -0.1 && !this.accelerate;
  }

  /**
   * Handler for when you mouse over the element.
   */
  onMouseEnter() {
    if (this.options.keyboard) {
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
    }

    document.body.style.overflow = 'hidden';
  }

  /**
   * Handler when your mouse leaves the element.
   */
  onMouseLeave() {
    if (this.options.keyboard) {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
    }

    document.body.style.overflow = '';

    if (this.isDragging) {
      this.release();
    }
  }

  /**
   * Handler for the key up event.
   * @param {!event} e
   */
  onKeyDown(e) {
    if([37,38,39,40].indexOf(e.keyCode) === -1) return;

    if (this.options.direction === DIRECTION.vertical) {
      this.animationLoop.start();
      switch(e.keyCode) {
        case KEY.down:
          this.accelerate = true;
          this.accelerationVector.setY(0.6);
          break;
        case KEY.up:
          this.accelerate = true;
          this.accelerationVector.setY(-0.6);
          break;
      }
    } else {
      this.animationLoop.start();
      switch(e.keyCode) {
        case KEY.left:
          this.accelerate = true;
          this.accelerationVector.setX(0.6);
          break;
        case KEY.right:
          this.accelerate = true;
          this.accelerationVector.setX(-0.6);
          break;
      }
    }
  }

  /**
   * Handler for the key down event.
   */
  onKeyUp() {
    this.accelerate = false;
  }

  /**
   * Handler for when user taps or mouse clicks the component.
   * @param {!event} e
   */
  tap(e) {
    this.velocityVector.set(0);
    this.accelerate = false;
    this.animationLoop.stop();

    if (this.options.direction === DIRECTION.vertical) {
      this.previousPosition = this.getPositions(e).y;
    } else {
      this.previousPosition = this.getPositions(e).x;
    }

    this.element.addEventListener('mousemove', this.drag);
    this.element.addEventListener('mouseup', this.release);

    if (this.isTouch()) {
      this.element.addEventListener('touchmove', this.drag);
      this.element.addEventListener('touchend', this.release);
    }

    e.preventDefault();
  }

  /**
   * Handler for when the user drags or mouse drags the component.
   * @param {!event} e
   */
  drag(e) {
    this.isDragging = true;
    let currentPosition = 0;

    if (this.options.direction === DIRECTION.vertical) {
      currentPosition = this.getPositions(e).y;
    } else {
      currentPosition= this.getPositions(e).x;
    }

    this.deltaAmount = this.previousPosition - currentPosition;
    let timeStamp = Date.now();

    this.previousPositions.push({
      delta: this.deltaAmount,
      timeStamp: timeStamp
    });

    if (this.previousPositions.length > 200) {
      this.previousPositions.length = 100;
    }

    if (this.deltaAmount > 2 || this.deltaAmount < -2) {
      this.previousPosition = currentPosition;
      this.update();
    }

    e.preventDefault();
  }

  /**
   * Handler for when the user releases the component.
   * @param {!event} e
   */
  release(e) {
    this.element.removeEventListener('mousemove', this.drag);
    this.element.removeEventListener('mouseup', this.release);

    if (this.isTouch()) {
      this.element.removeEventListener('touchmove', this.drag);
      this.element.removeEventListener('touchend', this.release);
    }

    this.isDragging = false;

    if (this.options.direction === DIRECTION.vertical) {
      this.velocityVector.setY(this.getAverageVelocity());
    } else {
      this.velocityVector.setX(this.getAverageVelocity());
    }

    this.accelerate = false;
    this.animationLoop.start();
    this.previousPositions.length = 0;
  }

  /**
   * Get current touch or mouse position.
   * @param {!event} e
   */
  getPositions(e) {
    const pos = {x: 0, y: 0};

    if (e.targetTouches && (e.targetTouches.length >= 1)) {
      pos.x = e.targetTouches[0].clientX;
      pos.y = e.targetTouches[0].clientY;
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
    return pos;
  }

  /**
   * Previous positions are recorded when we touch and drag. The
   * average velocity is calculated after we release.
   */
  getAverageVelocity() {
    if (this.previousPositions.length === 0) {
      return 0;
    }

    const sum = this.previousPositions.reduce((total, next) => {
      return total + next.delta;
    }, 0);

    return -(sum / this.previousPositions.length);
  }

  /**
   * Handler for when the window resizes.
   */
  onResize() {
    const previousMax = this.max;
    this.max = this.calculateMax(this.element, this.slideWrapper);
    const ratio = this.max / previousMax;
    this.positionVector.setY(this.positionVector.getY() * ratio);
    this.render();
  }

  /**
   * Update the slide containers translate position.
   */
  render() {
    this.slideWrapper.style.transform =
        `translate3d(${this.positionVector.getX()}px, ${this.positionVector.getY()}px, 0)`;
  }

  /**
   * Determines weather the current device has touch support.
   */
  isTouch() {
    return typeof window.ontouchstart !== undefined;
  }

  /**
   * Calculate the max the container can translate.
   * @param {!HTMLElement} element
   * @param {!HTMLElement} content
   * @return {number}
   */
  calculateMax(element, content) {
    if (this.options.direction === DIRECTION.vertical) {
      const height = content.getBoundingClientRect().height;
      const vpHeight = element.getBoundingClientRect().height;
      return height  - vpHeight;
    } else {
      const children = Array.from(content.children);
      const childrenWidth = children.reduce((prev, curr) => {
        return prev + curr.getBoundingClientRect().width;
      }, 0);

      const styles = window.getComputedStyle(content);
      const paddingTotal = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const width = childrenWidth + paddingTotal;

      const vpWidth = element.getBoundingClientRect().width;
      return width - vpWidth;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Slide);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__slide__ = __webpack_require__(0);



window.addEventListener('load', function() {
  const element = document.querySelector('.js-content-viewport');
  const slide = new __WEBPACK_IMPORTED_MODULE_0__slide__["a" /* default */](element, {
    direction: 'vertical',
    friction: .9,
    keyboard: true,
    touch: true
  });

  const horizontalElement = document.querySelector('.js-content-viewport-horizontal');
  const slideHorizontal = new __WEBPACK_IMPORTED_MODULE_0__slide__["a" /* default */](horizontalElement, {
    direction: 'horizontal',
    friction: .98,
    keyboard: true,
    touch: true
  });
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Engine);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector {
  /**
   * Create a vector.
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set x value of vector.
   * @param {number} x
   */
  setX(x) {
    this.x = x;
  }

  /**
   * Set y value of vector.
   * @param {number} y
   */
  setY(y) {
    this.y = y;
  }

  /**
   * Set both values in vector.
   * @param {number} value
   */
  set(value) {
    this.x = value;
    this.y = value;
  }

  /**
   * Gets x value of vector.
   * @return {number}
   */
  getX() {
    return this.x;
  }

  /**
   * Gets y value of vector.
   * @return {number}
   */
  getY() {
    return this.y;
  }

  /**
   * Adds vector to current vector.
   * @param {!Vector} vector
   */
  addTo(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  /**
   * Multiply vector by an amount.
   * @param {number} amount
   */
  multiplyBy(amount) {
    this.x = this.x * amount;
    this.y = this.y * amount;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Vector);


/***/ })
/******/ ]);