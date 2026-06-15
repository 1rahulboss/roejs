// roe.js
/**
 * roe - A lightweight library for applying CSS filter effects to images
 * Supports grayscale, blur, sepia, brightness, contrast, saturate, invert, hue-rotate, and reset
 * Works with CSS transitions or GSAP when available
 */

const roe = {
  /**
   * Apply a visual effect to all images inside a container
   * @param {string|Element} selector - CSS selector or DOM element containing images
   * @param {Object} options - Effect options
   * @param {string} options.effect - Effect name: 'grayscale', 'blur', 'sepia', 'brightness', 'contrast', 'saturate', 'invert', 'hue-rotate', 'reset'
   * @param {string|number} [options.amount] - Effect intensity (e.g., '50%', 0.5, '10px', '90deg')
   * @param {number} [options.duration=0.5] - Animation duration in seconds
   * @param {string} [options.ease='ease'] - CSS transition-timing-function or GSAP ease
   * @param {boolean} [options.gsap=false] - Use GSAP if available (requires GSAP library)
   * @returns {void}
   */
  imageEffect(selector, options = {}) {
    // Resolve container element
    const container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    
    if (!container) {
      throw new Error(`roe.imageEffect: Element "${selector}" not found`);
    }

    const images = container.querySelectorAll('img');
    if (images.length === 0) return;

    const {
      effect,
      amount,
      duration = 0.5,
      ease = 'ease',
      gsap: useGsap = false
    } = options;

    // Handle reset effect separately
    let filterValue;
    if (effect === 'reset') {
      filterValue = 'none';
    } else {
      const finalAmount = amount !== undefined ? amount : this._getDefaultAmount(effect);
      if (finalAmount === undefined) {
        console.warn(`roe.imageEffect: Effect "${effect}" not supported or missing amount`);
        return;
      }
      filterValue = this._buildFilter(effect, finalAmount);
    }

    this._applyFilter(images, filterValue, { duration, ease, useGsap });
  },

  /**
   * Get default amount for effects when none is provided
   * @private
   */
  _getDefaultAmount(effect) {
    const defaults = {
      grayscale: '100%',
      blur: '5px',
      sepia: '100%',
      brightness: '120%',
      contrast: '120%',
      saturate: '150%',
      invert: '100%',
      'hue-rotate': '90deg'
    };
    return defaults[effect];
  },

  /**
   * Build CSS filter value based on effect and amount
   * @private
   */
  _buildFilter(effect, amount) {
    // Normalize amount to string with proper units
    let normalizedAmount = amount;
    
    // Handle numeric values for percentage-based effects
    if (typeof amount === 'number') {
      if (['grayscale', 'sepia', 'invert'].includes(effect)) {
        // Convert 0-1 to percentage, clamp
        normalizedAmount = `${Math.min(100, Math.max(0, amount * 100))}%`;
      } else if (['brightness', 'contrast', 'saturate'].includes(effect)) {
        // Use decimal directly for these filters (1 = 100%)
        normalizedAmount = amount;
      } else if (effect === 'hue-rotate') {
        normalizedAmount = `${amount}deg`;
      }
    }

    // Ensure proper units for blur
    if (effect === 'blur' && typeof normalizedAmount === 'number') {
      normalizedAmount = `${normalizedAmount}px`;
    }

    // Convert string percentages to proper format
    if (typeof normalizedAmount === 'string') {
      if (['grayscale', 'sepia', 'invert', 'brightness', 'contrast', 'saturate'].includes(effect)) {
        if (!normalizedAmount.endsWith('%') && !isNaN(parseFloat(normalizedAmount))) {
          normalizedAmount = `${parseFloat(normalizedAmount)}%`;
        }
      }
    }

    return `${effect}(${normalizedAmount})`;
  },

  /**
   * Apply filter to all images using CSS transition or GSAP
   * @private
   */
  _applyFilter(images, filterValue, { duration, ease, useGsap }) {
    const hasGsap = useGsap && typeof gsap !== 'undefined';
    
    if (hasGsap) {
      // GSAP animation for smooth, high-performance transitions
      images.forEach(img => {
        gsap.to(img, {
          duration: duration,
          filter: filterValue,
          ease: ease,
          overwrite: true
        });
      });
    } else {
      // CSS transitions - simple and no external dependencies
      images.forEach(img => {
        // Set transition property for smooth filter changes
        img.style.transition = `filter ${duration}s ${ease}`;
        img.style.filter = filterValue;
        
        // Clean up transition after animation ends to avoid affecting other style changes
        const onTransitionEnd = () => {
          if (img.style.transition === `filter ${duration}s ${ease}`) {
            img.style.transition = '';
          }
          img.removeEventListener('transitionend', onTransitionEnd);
        };
        img.addEventListener('transitionend', onTransitionEnd, { once: true });
      });
    }
  }
};

// Export for modern module systems
export default roe;

// Make available globally for script tags and CDN usage
if (typeof window !== 'undefined') {
  window.roe = roe;
}