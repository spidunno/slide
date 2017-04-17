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

export default Vector;
