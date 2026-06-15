// effects/gray.js
export function apply(element, options) {
  const { duration = 300, easing = 'ease' } = options;
  element.style.transition = `filter ${duration}ms ${easing}`;
  element.style.filter = `grayscale(100%)`;
}