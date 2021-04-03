// Some assorted methods and constants that tidy up code later on

// Underscore used to mark unknowns/unmarked cells - a convention used in filling in givens
const _ = -1;

// Shortcut to get elements by ID
const $ = (id) => {
  return document.getElementById(id);
};

// Shortcut to generate a 2d array
const make2dArray = (rows, columns, value = 0) => {
  return Array.from(Array(rows), (row) => Array.from(columns).fill(value));
};

// Shortcut to create an SVG element and give it multiple attributes at once
const newSVG = (tag, props = {}) => {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  node.setAttributes = (attributes) => {
    for (let [key, value] of Object.entries(attributes)) {
      node.setAttribute(key, value);
    }
  };
  node.setAttributes(props);
  return node;
};

// More general method of setting multiple attributes at once
const setAttributes = (elem, attributes) => {
  for (let [key, value] of Object.entries(attributes)) {
    elem.setAttribute(key, value);
  }
};
