// Arrows to go between boards
// Set up a div to contain the arrows
// set up a <defs> element inside the main <svg> element
const arrowDiv = document.createElement("div");
arrowDiv.id = "arrows";
arrowDiv.style = "position: absolute; top: 0; left: 0;"; // width: 100%; height: 100%";

const arrows = newSVG("svg", {
  x: 0,
  y: 0,
  width: "100%",
  height: "100%",
  class: "arrows",
});
const arrowsGroup = newSVG("g");

const defs = newSVG("defs");
const arrow = newSVG("marker", {
  id: "arrow",
  markerWidth: 10,
  markerHeight: 10,
  refX: 5,
  refY: 5,
  viewBox: "0 0 10 10",
  orient: "auto-start-reverse",
});
const arrowShape = newSVG("path", {
  d: "M 0 0 L 10 5 L 0 10 z",
  stroke: "black",
});

document.body.appendChild(arrowDiv);
arrowDiv.appendChild(arrows);
arrows.appendChild(defs);
arrows.appendChild(arrowsGroup);
defs.appendChild(arrow);
arrow.appendChild(arrowShape);

// A function to create simple arrows (no text)
const plainArrow = (start, end, oneWay = false) => {
  let [x1, y1] = start;
  let [x2, y2] = end;
  const arrow = newSVG("line", {
    x1,
    y1,
    x2,
    y2,
    stroke: "black",
    "marker-end": "url(#arrow)",
  });
  if (!oneWay) {
    arrow.setAttributes({ "marker-start": "url(#arrow)" });
  }
  arrow.midpoint = [(x2 + x1) / 2, (y2 + y1) / 2];
  return arrow;
};

// Bézier curve arrow
const bezierArrow = (start, end, oneWay = false, scaling = 0.5) => {
  let [x1, y1] = start;
  let [x2, y2] = end;
  let [m1, n1] = [
    (x2 + 3 * x1) / 4 + (y2 - y1) * 0.75 * scaling,
    (y2 + 3 * y1) / 4 - (x2 - x1) * 0.75 * scaling,
  ];
  let [m2, n2] = [
    (3 * x2 + x1) / 4 + (y2 - y1) * 0.75 * scaling,
    (3 * y2 + y1) / 4 - (x2 - x1) * 0.75 * scaling,
  ];
  const arrow = newSVG("path", {
    d: `M ${x1} ${y1} C ${m1} ${n1} ${m2} ${n2} ${x2} ${y2}`,
    stroke: "black",
    fill: "none",
    "marker-end": "url(#arrow)",
  });
  if (!oneWay) {
    arrow.setAttributes({ "marker-start": "url(#arrow)" });
  }
  arrow.midpoint = [
    (x2 + x1) / 2 + (y2 - y1) * 0.75 * scaling,
    (y2 + y1) / 2 - (x2 - x1) * 0.75 * scaling,
  ];

  return arrow;
};

const tangentBezierArrow = (start, end, oneWay = false, scaling = 0.5) => {
  let [x1, y1] = start;
  let [x2, y2] = end;
  let [a1, b1] = [x1 + (y2 - y1) * scaling, y1 - (x2 - x1) * scaling];
  let [a2, b2] = [x2 + (y2 - y1) * scaling, y2 - (x2 - x1) * scaling];
  const arrow = newSVG("path", {
    d: `M ${x1} ${y1} C ${a1} ${b1} ${a2} ${b2} ${x2} ${y2}`,
    stroke: "black",
    fill: "none",
    "marker-end": "url(#arrow)",
  });
  if (!oneWay) {
    arrow.setAttributes({ "marker-start": "url(#arrow)" });
  }
  arrow.midpoint = [
    (x2 + x1) / 2 + (y2 - y1) * 0.75 * scaling,
    (y2 + y1) / 2 - (x2 - x1) * 0.75 * scaling,
  ];

  return arrow;
};

const textNode = (anchor, ...texts) => {
  const text = newSVG("g", {
    "font-size": "12px",
    "text-anchor": "middle",
    transform: `translate(${anchor[0]}, ${anchor[1] + 8 - 12 * texts.length})`,
  });
  texts.forEach((line, i) => {
    const newLine = newSVG("text", {
      dx: 0,
      dy: i * 12,
    });
    newLine.textContent = line;
    text.appendChild(newLine);
  });
  return text;
};

const corner = (board, corner) => {
  const box = board.node.getBoundingClientRect();
  if (corner == "tl") {
    // Top left
    return [box.x + 0.1 * box.width + window.scrollX, box.y + window.scrollY];
  } else if (corner == "tr") {
    // Top right
    return [box.x + 0.9 * box.width + window.scrollX, box.y + window.scrollY];
  } else if (corner == "bl") {
    // Bottom left
    return [
      box.x + 0.1 * box.width + window.scrollX,
      box.bottom + window.scrollY,
    ];
  } else {
    // Bottom right
    return [
      box.x + 0.9 * box.width + window.scrollX,
      box.bottom + window.scrollY,
    ];
  }
};

const arrowUpdate = () => {
  arrowsGroup.innerHTML = "";
  arrowDiv.style.width = document.documentElement.scrollWidth + "px";
  arrowDiv.style.height = document.documentElement.scrollHeight + "px";

  const widthUnit = game.akari.node.getBoundingClientRect().width;
  const akariDOM = game.akari.node.getBoundingClientRect();
  const hitoriDOM = game.hitori.node.getBoundingClientRect();
  const hitorilinkDOM = game.hitorilink.node.getBoundingClientRect();
  const shikakuDOM = game.shikaku.node.getBoundingClientRect();
  const slitherlinkDOM = game.slitherlink.node.getBoundingClientRect();

  // Arrow and text for Akari alone
  let akaTL = corner(game.akari, "tl");
  let akaStart = [akaTL[0], akaTL[1] - 0.33 * widthUnit];
  arrowsGroup.appendChild(plainArrow(akaStart, akaTL, true));
  arrowsGroup.appendChild(
    textNode(akaStart, "Shaded cell: real clue", "Unshaded cell: ignore number")
  );

  // Arrow and text between Akari and Shikaku
  const akashi = bezierArrow(
    corner(game.akari, "tr"),
    corner(game.shikaku, "tl")
  );
  arrowsGroup.appendChild(akashi);
  arrowsGroup.appendChild(textNode(akashi.midpoint, "Lightbulb ⇔ Real clue"));

  // Arrow and text between Akari and Hitorilink
  const akahil = bezierArrow(
    corner(game.hitorilink, "tl"),
    corner(game.akari, "bl"),
    false,
    0.1
  );
  arrowsGroup.appendChild(akahil);
  arrowsGroup.appendChild(
    textNode([akahil.midpoint[0] + 55, akahil.midpoint[1]], "Same shaded cells")
  );

  // Arrows and text between Hitori, Slitherlink, and Hitorilink
  let hitTR = corner(game.hitori, "tr");
  let hitEnd = [hitTR[0], hitTR[1] - 0.2 * widthUnit];
  let sliTL = corner(game.slitherlink, "tl");
  let sliEnd = [hitEnd[0] + 0.2 * widthUnit, hitEnd[1]];
  arrowsGroup.appendChild(plainArrow(hitTR, hitEnd, true));
  arrowsGroup.appendChild(plainArrow(sliTL, sliEnd, true));
  arrowsGroup.appendChild(
    textNode([hitEnd[0] + 30, hitEnd[1] - 8], "Add numbers mod 10")
  );
  let hilStart = [hitEnd[0], hitEnd[1] - 32];
  arrowsGroup.appendChild(
    plainArrow(hilStart, corner(game.hitorilink, "br"), true)
  );

  // Arrow and text between Slitherlink and Corral
  const slicor = bezierArrow(
    corner(game.slitherlink, "br"),
    corner(game.corral, "bl"),
    false,
    -0.5
  );
  arrowsGroup.appendChild(slicor);
  arrowsGroup.appendChild(
    textNode([slicor.midpoint[0], slicor.midpoint[1] + 12], "Same loop")
  );
};

arrowUpdate();
window.onresize = arrowUpdate;
