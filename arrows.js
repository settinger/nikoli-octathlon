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

const corner = (board, corner, actualCorner = false) => {
  const box = board.getBoundingClientRect();
  const adjust = actualCorner ? 0 : 0.1 * box.width;
  if (corner == "tl") {
    // Top left
    return [box.x + adjust + window.scrollX, box.y + window.scrollY];
  } else if (corner == "tr") {
    // Top right
    return [
      box.x + box.width - adjust + window.scrollX,
      box.y + window.scrollY,
    ];
  } else if (corner == "bl") {
    // Bottom left
    return [box.x + adjust + window.scrollX, box.bottom + window.scrollY];
  } else {
    // Bottom right
    return [
      box.x + box.width - adjust + window.scrollX,
      box.bottom + window.scrollY,
    ];
  }
};

const arrowUpdate = () => {
  arrowsGroup.innerHTML = "";
  arrowDiv.style.width = document.documentElement.scrollWidth + "px";
  arrowDiv.style.height = document.documentElement.scrollHeight + "px";

  const widthUnit = game.akari.node.getBoundingClientRect().width;

  // Arrow and text for Akari alone
  let akaTL = corner(game.akari.node, "tl");
  let akaStart = [akaTL[0], akaTL[1] - 0.33 * widthUnit];
  arrowsGroup.appendChild(plainArrow(akaStart, akaTL, true));
  arrowsGroup.appendChild(
    textNode(
      [akaStart[0] + 20, akaStart[1]],
      "Shaded cell: real clue",
      "Unshaded cell: ignore number"
    )
  );

  // Arrow and text between Akari and Shikaku
  const akashi = bezierArrow(
    corner(game.akari.node, "tr"),
    corner(game.shikaku.node, "tl")
  );
  arrowsGroup.appendChild(akashi);
  arrowsGroup.appendChild(textNode(akashi.midpoint, "Lightbulb ⇔ Real clue"));

  // Arrow and text between Shikaku and Heyawake
  const shihey = bezierArrow(
    corner(game.shikaku.node, "tr"),
    corner(game.heyawake.node, "tl")
  );
  arrowsGroup.appendChild(shihey);
  arrowsGroup.appendChild(textNode(shihey.midpoint, "Same rectangles"));

  // Arrow and text between Kurodoko and Heyawake
  const kurhey = plainArrow(
    corner(game.kurodoko.node, "br"),
    corner(game.heyawake.node, "tr")
  );
  arrowsGroup.appendChild(kurhey);
  arrowsGroup.appendChild(
    textNode([kurhey.midpoint[0] - 55, kurhey.midpoint[1]], "Same shaded cells")
  );

  // Arrow and text between Akari and Hitorilink
  const akahil = bezierArrow(
    corner(game.hitorilink.node, "tl"),
    corner(game.akari.node, "bl"),
    false,
    0.1
  );
  arrowsGroup.appendChild(akahil);
  arrowsGroup.appendChild(
    textNode([akahil.midpoint[0] + 55, akahil.midpoint[1]], "Same shaded cells")
  );

  // Arrows and text between Hitori, Slitherlink, and Hitorilink
  let hitTR = corner(game.hitori.node, "tr");
  let hitEnd = [hitTR[0], hitTR[1] - 0.2 * widthUnit];
  let sliTL = corner(game.slitherlink.node, "tl");
  let sliEnd = [hitEnd[0] + 0.2 * widthUnit, hitEnd[1]];
  arrowsGroup.appendChild(plainArrow(hitTR, hitEnd, true));
  arrowsGroup.appendChild(plainArrow(sliTL, sliEnd, true));
  arrowsGroup.appendChild(
    textNode([hitEnd[0] + 30, hitEnd[1] - 8], "Add numbers mod 10")
  );
  let hilStart = [hitEnd[0], hitEnd[1] - 32];
  arrowsGroup.appendChild(
    plainArrow(hilStart, corner(game.hitorilink.node, "br"), true)
  );

  // Arrows and text between Kurodoko, Nurikabe, Nurikuro
  let kurBR = corner(game.kurodoko.node, "br");
  kurBR = [kurBR[0] + 0.1 * widthUnit, kurBR[1] - 0.1 * widthUnit];
  let nurBL = corner(game.nurikabe.node, "bl");
  let nurEnd = [nurBL[0], nurBL[1] + 0.2 * widthUnit];
  let kurEnd = [nurEnd[0] - 0.1 * widthUnit, nurEnd[1]];
  let nkStart = [nurEnd[0], nurEnd[1] + 24];
  arrowsGroup.appendChild(plainArrow(kurBR, kurEnd, true));
  arrowsGroup.appendChild(plainArrow(nurBL, nurEnd, true));
  arrowsGroup.appendChild(textNode(nkStart, "Add numbers"));
  arrowsGroup.appendChild(
    plainArrow(nkStart, corner(game.nurikuro.node, "tl"), true)
  );

  // Arrow and text between Slitherlink and Corral
  const slicor = bezierArrow(
    corner(game.slitherlink.node, "br"),
    corner(game.corral.node, "bl"),
    false,
    -0.5
  );
  arrowsGroup.appendChild(slicor);
  arrowsGroup.appendChild(
    textNode([slicor.midpoint[0], slicor.midpoint[1] + 12], "Same loop")
  );

  // Nurikabe and Fillomino arrows
  const nurBR = corner(game.nurikabe.node, "br");
  const filTR = corner(game.fillomino.node, "tr");
  const nurfil = [filTR[0] - 70, filTR[1] - 0.3 * widthUnit];
  arrowsGroup.appendChild(bezierArrow(nurBR, filTR, false, 0.2));
  arrowsGroup.appendChild(textNode(nurfil, "Shaded Nurikabe ⇔ Fillomino liar"));

  // Fillomino and Country Road arrows
  const coufil = bezierArrow(
    corner(game.countryRoad.node, "tr"),
    corner(game.fillomino.node, "tl")
  );
  arrowsGroup.appendChild(coufil);
  arrowsGroup.appendChild(textNode(coufil.midpoint, "Same rooms"));

  // Masyu and Country Road
  const coumas = plainArrow(
    corner(game.countryRoad.node, "br"),
    corner(game.masyu.node, "tl")
  );
  arrowsGroup.appendChild(coumas);
  arrowsGroup.appendChild(
    textNode([coumas.midpoint[0] + 30, coumas.midpoint[1]], "Same loop")
  );

  // The more elaborate Masyu+Corral instructions
  const cmBR = corner(game.corralsyu.node, "br");
  const masTL = corner(game.masyu.node, "tl");
  const cmMidpt = [
    (cmBR[0] + masTL[0]) / 2 - 45,
    (cmBR[1] + masTL[1]) / 2 + 12,
  ];
  const cmText = textNode(
    cmMidpt,
    "If correct clue in Masyu, copy corresponding",
    "number from full Corral grid to empty one"
  );

  arrowsGroup.appendChild(cmText);

  const cmDOM = cmText.getBoundingClientRect();
  const cmRect = newSVG("rect", {
    x: cmDOM.x + window.scrollX - 6,
    y: cmDOM.y + window.scrollY - 6,
    width: cmDOM.width + 12,
    height: cmDOM.height + 12,
    stroke: "black",
    fill: "white",
  });
  arrowsGroup.insertBefore(cmRect, cmText);
  arrowsGroup.appendChild(
    plainArrow(
      corner(cmRect, "br", true),
      corner(game.masyu.node, "tl", true),
      true
    )
  );
  arrowsGroup.appendChild(
    plainArrow(corner(cmRect, "br"), corner(game.corral.node, "tr"), true)
  );
  arrowsGroup.appendChild(
    plainArrow(
      corner(cmRect, "tl", true),
      corner(game.corralsyu.node, "br"),
      true
    )
  );
};

arrowUpdate();
window.onresize = arrowUpdate;
