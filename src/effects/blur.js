// effects/blur.js
export function apply(element, options) {
  const { duration = 300, easing = 'ease', blurAmount = '5px' } = options;
  element.style.transition = `filter ${duration}ms ${easing}`;
  element.style.filter = `blur(${blurAmount})`;
}