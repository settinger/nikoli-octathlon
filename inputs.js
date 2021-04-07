// Show or hide the input methods available for a particular puzzle

let currInput;

const clearInputs = (event) => {
  inputsDivTop.innerHTML = "";
  inputsDivBottom.innerHTML = "";
  game.currMark = game.markPref;
};

const showInputs = (puzz) => {
  switch (puzz) {
    case "kurodoko":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Kurodoko</b>
  <div>
    <ul>
      <li>Left/right click clue cell: increase/decrease clue value</li>
      <li>Left/right click non-clue cell: toggle shading</li>
    </ul>
  </div>
</div>`;
      break;
    case "nurikabe":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Nurikabe</b>
  <div>
    <ul>
      <li>Left/right click clue cell: increase/decrease clue value</li>
      <li>Left/right click non-clue cell: toggle shading</li>
    </ul>
  </div>
</div>`;
      break;
    case "nurikuro":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Nurikabe + Kurodoko</b>
  <div>
    <ul>
      <li>Left/right click non-clue cell: toggle shading</li>
    </ul>
  </div>
</div>`;
      break;
    case "akari":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Akari</b>
  <div>
    <ul>
      <li>Left/right click cell: toggle shading and presence/absence of lamp</li>
      <li>True clues are circled; false clues are faded</li>
    </ul>
  </div>
</div>`;
      break;
    case "shikaku":
      inputsDivTop.innerHTML = `
<div>
  <b>Shikaku</b>
  <div>
    <ul>${
      game.currMark == "cells"
        ? `
<li>Left/right click clue cell: toggle clue truth</li>
<li>True clues are circled; false clues are faded</li>
<li>Press space bar to switch to wall placement mode</li>
`
        : `
<li>Left/right click vertex: toggle presence of wall</li>
<li>Press space bar to switch to clue truth mode</li>
`
    }
    </ul>
  </div>
</div>
`;
      break;
    case "heyawake":
      inputsDivTop.innerHTML = `
<div>
  <b>Heyawake</b>
  <div>
    <ul>${
      game.currMark == "cells"
        ? `
<li>Left click: toggle cell shading</li>
<li>Right click clue cell: toggle clue truth</li>
<li>Press space bar to switch to wall placement mode</li>
`
        : `
<li>Left/right click vertex: toggle presence of wall</li>
<li>Press space bar to switch to shading/clue truth mode</li>
`
    }
    </ul>
  </div>
</div>
`;
      break;
    case "hitorilink":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Hitori + Slitherlink</b>
  <div>
    <ul>
      <li>Left/right click: toggle shading</li>
    </ul>
  </div>
</div>`;
      break;
    case "hitori":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Hitori</b>
  <div>
    <ul>
      <li>Left/right click: toggle shading</li>
    </ul>
  </div>
</div>`;
      break;
    case "slitherlink":
      inputsDivTop.innerHTML = `
<div>
  <b>Slitherlink</b>
  <div>
    <ul>${
      game.currMark == "cells"
        ? `
<li>Left/right click: toggle clue value</li>
<li>Press space bar to switch to loop mode</li>
`
        : `
<li>Left/right click vertex: place loop segment or X</li>
<li>Press space bar to switch to clue value mode</li>
`
    }
    </ul>
  </div>
</div>
`;
      break;
    case "corralsyu":
      game.currMark = "cells";
      inputsDivTop.innerHTML = `
<div>
  <b>Corral + Masyu</b>
  <div>
    <ul>
      <li>Left click: toggle Corral shading</li>
      <li>Right click: toggle Masyu clue truth</li>
    </ul>
  </div>
</div>`;
      break;
    case "corral":
      inputsDivTop.innerHTML = `
<div>
  <b>Corral</b>
  <div>
    <ul>${
      game.currMark == "cells"
        ? `
<li>Left/right click: toggle cell shading</li>
<li>Press space bar to switch to loop mode</li>
`
        : `
<li>Left/right click vertex: place loop segment or X</li>
<li>Press space bar to switch to cell shading mode</li>
`
    }
    </ul>
  </div>
</div>
`;
      break;
    case "masyu":
      inputsDivTop.innerHTML = `
<div>
  <b>Masyu</b>
  <div>
    <ul>${
      game.currMark == "cells"
        ? `
<li>Left/right click: toggle clue truth</li>
<li>Press space bar to switch to loop mode</li>
`
        : `
<li>Left/right click vertex: place loop segment or X</li>
<li>Press space bar to switch to cell shading mode</li>
`
    }
    </ul>
  </div>
</div>
`;
      break;
    case "countryroad":
      game.currMark = "vertices";
      inputsDivTop.innerHTML = `
<div>
  <b>Country Road</b>
  <div>
    <ul>
      <li>Left click vertex: toggle loop placement</li>
      <li>Right click vertex: toggle wall placement</li>
    </ul>
  </div>
</div>`;
      break;
    case "fillomino":
      inputsDivTop.innerHTML = `
<div>
  <b>Fillomino</b>
  <div>
    <ul>${
      game.currMark == "cells"
        ? `
<li>Left/right click clue cell: toggle clue truth</li>
<li>True clues are circled; false clues are faded</li>
<li>Press space bar to switch to wall placement mode</li>
`
        : `
<li>Left/right click vertex: toggle wall placement</li>
<li>Press space bar to switch to clue truth mode</li>
`
    }
    </ul>
  </div>
</div>
`;
      break;

    default:
      inputsDivTop.innerHTML = "";
  }
  inputsDivBottom.innerHTML = inputsDivTop.innerHTML;
};

kurodokoDiv.addEventListener("mouseenter", (e) => showInputs("kurodoko"));
kurodokoDiv.addEventListener("mouseleave", clearInputs);

nurikabeDiv.addEventListener("mouseenter", (e) => showInputs("nurikabe"));
nurikabeDiv.addEventListener("mouseleave", clearInputs);

nurikuroDiv.addEventListener("mouseenter", (e) => showInputs("nurikuro"));
nurikabeDiv.addEventListener("mouseleave", clearInputs);

akariDiv.addEventListener("mouseenter", (e) => showInputs("akari"));
akariDiv.addEventListener("mouseleave", clearInputs);

shikakuDiv.addEventListener("mouseenter", (e) => showInputs("shikaku"));
shikakuDiv.addEventListener("mouseleave", clearInputs);

heyawakeDiv.addEventListener("mouseenter", (e) => showInputs("heyawake"));
heyawakeDiv.addEventListener("mouseleave", clearInputs);

hitorilinkDiv.addEventListener("mouseenter", (e) => showInputs("hitorilink"));
hitorilinkDiv.addEventListener("mouseleave", clearInputs);

hitoriDiv.addEventListener("mouseenter", (e) => showInputs("hitori"));
hitoriDiv.addEventListener("mouseleave", clearInputs);

slitherlinkDiv.addEventListener("mouseenter", (e) => showInputs("slitherlink"));
slitherlinkDiv.addEventListener("mouseleave", clearInputs);

corralsyuDiv.addEventListener("mouseenter", (e) => showInputs("corralsyu"));
corralsyuDiv.addEventListener("mouseleave", clearInputs);

corralDiv.addEventListener("mouseenter", (e) => showInputs("corral"));
corralDiv.addEventListener("mouseleave", clearInputs);

masyuDiv.addEventListener("mouseenter", (e) => showInputs("masyu"));
masyuDiv.addEventListener("mouseleave", clearInputs);

countryDiv.addEventListener("mouseenter", (e) => showInputs("countryroad"));
countryDiv.addEventListener("mouseleave", clearInputs);

fillominoDiv.addEventListener("mouseenter", (e) => showInputs("fillomino"));
fillominoDiv.addEventListener("mouseleave", clearInputs);
