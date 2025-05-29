// CSS Utilities for dynamic styling and animations

/**
 * Applies CSS classes dynamically to elements
 * @param {HTMLElement} element - The target element
 * @param {string|Array} classes - CSS class(es) to apply
 */
export const applyClasses = (element, classes) => {
  if (!element) return;
  
  if (Array.isArray(classes)) {
    classes.forEach(cls => element.classList.add(cls));
  } else {
    element.classList.add(classes);
  }
};

/**
 * Removes CSS classes from elements
 * @param {HTMLElement} element - The target element
 * @param {string|Array} classes - CSS class(es) to remove
 */
export const removeClasses = (element, classes) => {
  if (!element) return;
  
  if (Array.isArray(classes)) {
    classes.forEach(cls => element.classList.remove(cls));
  } else {
    element.classList.remove(classes);
  }
};

/**
 * Toggles CSS classes on elements
 * @param {HTMLElement} element - The target element
 * @param {string} className - CSS class to toggle
 */
export const toggleClass = (element, className) => {
  if (!element) return;
  element.classList.toggle(className);
};

/**
 * Gets computed styles for an element
 * @param {HTMLElement} element - The target element
 * @param {string} property - CSS property to get
 * @returns {string} The computed style value
 */
export const getComputedStyle = (element, property) => {
  if (!element) return '';
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Sets CSS custom properties (variables)
 * @param {HTMLElement} element - The target element
 * @param {string} property - CSS custom property name
 * @param {string} value - The value to set
 */
export const setCSSVariable = (element, property, value) => {
  if (!element) return;
  element.style.setProperty(`--${property}`, value);
};

/**
 * Animates element with CSS transitions
 * @param {HTMLElement} element - The target element
 * @param {Object} styles - CSS styles to animate to
 * @param {number} duration - Animation duration in ms
 */
export const animateElement = (element, styles, duration = 300) => {
  if (!element) return Promise.resolve();
  
  return new Promise((resolve) => {
    const originalTransition = element.style.transition;
    element.style.transition = `all ${duration}ms ease`;
    
    Object.keys(styles).forEach(property => {
      element.style[property] = styles[property];
    });
    
    setTimeout(() => {
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
};
