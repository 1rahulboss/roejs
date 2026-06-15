// roe.js
import * as blurEffect from './effects/blur.js';
import * as grayEffect from './effects/gray.js';

const effects = {
  blur: blurEffect.apply,
  gray: grayEffect.apply,
  none: (el, opts) => {}
};

export default class roe {
  // Constructor: stores element and default options for this instance
  constructor(selector, userOptions = {}) {
    const defaultOptions = {
      effect: 'none',
      blurAmount: '5px',
      duration: 300,
      easing: 'ease'
    };
    this.options = { ...defaultOptions, ...userOptions };

    this.element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector instanceof HTMLElement ? selector : null;

    if (!this.element) {
      throw new Error(`Element not found for selector: ${selector}`);
    }
  }

  // Instance method: applies stored effect to the stored element
  applyEffect(customOptions = {}) {
    const options = { ...this.options, ...customOptions };
    const applyFn = effects[options.effect] || effects.none;
    applyFn(this.element, options);
    return this; // for chaining
  }

  // Instance method: change effect type and re-apply
  setEffect(effectType, extraOptions = {}) {
    this.options.effect = effectType;
    Object.assign(this.options, extraOptions);
    return this.applyEffect();
  }

  // Static method (convenience for one‑off usage)
  static imgEffect(selector, userOptions = {}) {
    const instance = new roe(selector, userOptions);
    instance.applyEffect();
  }
}