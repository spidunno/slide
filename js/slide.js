import Engine from './engine';
import Vector from './vector';


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
    this.contentWrapper = element;
    this.contentElement = element.querySelector('.js-content');
    this.contentHeight = this.contentElement.getBoundingClientRect().height;

    this.defaultOptions = {
      direction: DIRECTION.vertical
    };

    this.options = Object.assign({}, this.defaultOptions, options);

    this.friction = 0.96;
    this.positionVector = new Vector();
    this.velocityVector = new Vector();
    this.accelerationVector = new Vector();

    this.update = this.update.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.accelerate = false;
    this.animationLoop = new Engine(this.update);
    this.max = this.calculateMax(this.contentWrapper, this.contentElement);

    this.addEvents();
  }

  update() {
    this.calculateVelocity();
    this.positionVector.addTo(this.velocityVector);

    if (this.positionVector.getY() > 0) {
      this.positionVector.setY(0);
      this.velocityVector.setY(0);
    }

    if (this.positionVector.getY() < -(this.max)) {
      this.positionVector.setY(-this.max);
      this.velocityVector.setY(0);
    }

    if (this.velocityVector.getY() <= 0.01 && this.velocityVector.getY() >= -0.01 && !this.accelerate) {
      this.animationLoop.stop();
    }

    this.render();
  }

  calculateVelocity() {
    if (this.accelerate) {
      this.velocityVector.addTo(this.accelerationVector);
    } else {
      this.velocityVector.multiplyBy(this.friction);
    }
  }

  addEvents() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  /**
   *
   * @param {event} e
   */
  onKeyDown(e) {
    if([37,38,39,40].indexOf(e.keyCode) === -1) return;

    this.animationLoop.start();

    if (this.direction === DIRECTION.vertical) {
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

  onKeyUp() {
    this.accelerate = false;
  }

  render() {
    this.contentElement.style.transform = `translate3d(${this.positionVector.getX()}px, ${this.positionVector.getY()}px, 0)`;
  }

  /**
   *
   * @param {!HTMLElement} contentWrapper
   * @param {!HTMLElement} content
   */
  calculateMax(contentWrapper, content) {
    if (this.options.direction === DIRECTION.vertical) {
      const height = content.offsetHeight;
      const vpHeight = contentWrapper.getBoundingClientRect().height;
      return height  - vpHeight;
    } else {
      const width = content.offsetWidth;
      const vpWidth = contentWrapper.getBoundingClientRect().width;
      return width - vpWidth;
    }
  }
}

export default Slide;
