const samples = [
  [1,"156","002",20261016,120,28,21,127,373,355,41,80,835,1213,"context limit"],
  [2,"745","002",20261017,100,32,20,109,405,313,38,74,737,1311,"context limit"],
  [3,"664","002",20261018,134,32,19,161,335,315,37,68,961,1087,"context limit"],
  [4,"487","000",20261019,120,27,15,110,381,361,39,74,835,1213,"context limit"],
  [5,"704","003",20261020,100,29,16,110,422,297,32,68,706,1342,"context limit"],
  [6,"300","002",20261021,120,21,17,163,220,349,40,73,855,765,"bar-count stop"],
  [7,"500","000",20261022,120,32,17,112,387,362,35,71,815,1233,"context limit"],
  [8,"196","001",20261023,120,28,21,136,350,318,39,70,906,1142,"context limit"],
  [9,"126","002",20261024,120,29,22,123,354,348,37,67,887,1161,"context limit"],
  [10,"763","001",20261025,100,26,23,106,352,380,40,72,750,1160,"bar-count stop"]
].map(([number,song,window,seed,tempo,expectedBars,generatedBars,melodyNotes,pianoNotes,referenceNotes,pitchMin,pitchMax,promptTokens,generatedTokens,stop]) => ({
  number,song,window,seed,tempo,expectedBars,generatedBars,melodyNotes,pianoNotes,
  referenceNotes,pitchMin,pitchMax,promptTokens,generatedTokens,stop,
  folder: `${String(number).padStart(2,"0")}_pop909-cl_${song}_window-${window}`
}));

const colors = ["#5aa89f","#d4a53c","#8a63b8","#55a69f","#5276a9","#c36b55"];
const previousSamples = [
  [1,"664","001",20261013,112,72,95,147,309,37,70,739,1309],
  [2,"459","001",20261014,65,47,47,188,365,36,67,762,1285],
  [3,"159","003",20261015,93,61,71,102,399,41,70,560,1483],
  [4,"633","001",20261016,83,57,61,148,373,40,63,682,1365],
  [5,"796","002",20261017,74,62,75,108,388,37,70,582,1466],
  [6,"273","001",20261018,74,57,56,112,416,36,67,574,1474],
  [7,"462","000",20261019,47,48,49,199,350,38,70,800,1248],
  [8,"120","000",20261020,63,50,57,143,392,41,68,640,1406],
  [9,"379","001",20261021,60,44,39,114,454,45,76,528,1520],
  [10,"907","000",20261022,128,64,68,98,404,41,74,561,1486],
  [11,"696","004",20261023,71,36,93,72,434,32,68,370,1676],
  [12,"661","004",20261024,68,27,49,71,505,38,69,331,1713],
  [13,"050","002",20261025,65,45,42,243,319,36,74,919,1127],
  [14,"230","001",20261026,74,56,75,136,367,41,69,642,1403],
  [15,"054","003",20261027,70,47,66,112,414,32,78,534,1508],
  [16,"037","002",20261028,74,61,87,136,345,41,69,662,1385]
].map(([number,song,window,seed,tempo,conditionBars,generatedBars,melodyNotes,pianoNotes,pitchMin,pitchMax,promptTokens,generatedTokens]) => ({
  number,song,window,seed,tempo,conditionBars,generatedBars,melodyNotes,pianoNotes,
  pitchMin,pitchMax,promptTokens,generatedTokens,
  folder: `${String(number).padStart(2,"0")}_pop909_${song}_window-${window}_seed-${seed}`
}));
const modeFiles = {
  melody: ["Given melody", "condition-melody.mid"],
  chords: ["Given chord guide", "condition-chords.mid"],
  reference: ["Reference piano", "reference-piano.mid"],
  generated: ["Generated piano", "generated-piano.mid"],
  combined: ["Melody + chord guide + generated piano", "combined.mid"]
};
let selectedSample = 0;
let selectedMode = "combined";
let selectedPreviousSample = 0;
let selectedPreviousMode = "combined";

const tabHost = document.querySelector("#sample-tabs");
const player = document.querySelector("#midi-player");
const visualizer = document.querySelector("#midi-visualizer");

samples.forEach((sample, index) => {
  const button = document.createElement("button");
  button.className = "sample-tab";
  button.type = "button";
  button.role = "tab";
  button.textContent = `Sample ${String(sample.number).padStart(2,"0")}`;
  button.style.setProperty("--dot", colors[index % colors.length]);
  button.addEventListener("click", () => { selectedSample = index; render(); });
  tabHost.appendChild(button);
});

const previousTabHost = document.querySelector("#previous-sample-tabs");
previousSamples.forEach((sample, index) => {
  const button = document.createElement("button");
  button.className = "previous-sample-tab sample-tab";
  button.type = "button";
  button.role = "tab";
  button.textContent = `Sample ${String(sample.number).padStart(2,"0")}`;
  button.style.setProperty("--dot", colors[index % colors.length]);
  button.addEventListener("click", () => { selectedPreviousSample = index; renderPrevious(); });
  previousTabHost.appendChild(button);
});

document.querySelectorAll(".mode-tab").forEach(button => {
  if (button.dataset.mode) {
    button.addEventListener("click", () => { selectedMode = button.dataset.mode; render(); });
  }
});

document.querySelectorAll(".previous-mode-tab").forEach(button => {
  button.addEventListener("click", () => { selectedPreviousMode = button.dataset.previousMode; renderPrevious(); });
});

function midiPath(sample, mode) {
  return `assets/midi-key-chord/${sample.folder}/${modeFiles[mode][1]}`;
}

function stat(label, value, warning = false) {
  return `<span class="stat${warning ? " warning" : ""}"><b>${label}</b>${value}</span>`;
}

function render() {
  const sample = samples[selectedSample];
  document.querySelectorAll(".sample-tab").forEach((button, index) => {
    button.setAttribute("aria-selected", String(index === selectedSample));
  });
  document.querySelectorAll(".mode-tab").forEach(button => {
    button.setAttribute("aria-selected", String(button.dataset.mode === selectedMode));
  });
  document.querySelector("#sample-kicker").textContent = `POP909-CL · SAMPLE ${String(sample.number).padStart(2,"0")}`;
  document.querySelector("#sample-title").textContent = `Song ${sample.song} · Window ${sample.window}`;
  document.querySelector("#stats").innerHTML = [
    stat("TEMPO", `${sample.tempo} BPM`), stat("METER", "4/4"),
    stat("MELODY", `${sample.expectedBars} bars · ${sample.melodyNotes} notes`),
    stat("GENERATED", `${sample.generatedBars}/${sample.expectedBars} bars · ${sample.pianoNotes} notes`, true),
    stat("REFERENCE", `${sample.referenceNotes} notes`), stat("PITCH", `${sample.pitchMin}–${sample.pitchMax}`),
    stat("SEED", sample.seed), stat("RAW STRUCTURE", "incomplete", true)
  ].join("");
  const path = midiPath(sample, selectedMode);
  player.src = path;
  visualizer.src = path;
  document.querySelector("#player-title").textContent = modeFiles[selectedMode][0];
  const download = document.querySelector("#download-current");
  download.href = path;
  download.download = `${sample.folder}-${modeFiles[selectedMode][1]}`;
  document.querySelector("#generation-note").innerHTML =
    `Prompt ${sample.promptTokens} tokens · Generated ${sample.generatedTokens} tokens · ` +
    `<strong>Unconstrained REMI sampling produced ${sample.generatedBars}/${sample.expectedBars} parseable bars (${sample.stop}).</strong> ` +
    `<a href="assets/midi-key-chord/${sample.folder}/generation-report.json">View raw report</a>`;
}

function previousMidiPath(sample, mode) {
  const files = { condition: "condition.mid", generated: "generated-piano.mid", combined: "combined.mid" };
  return `assets/midi/${sample.folder}/${files[mode]}`;
}

function renderPrevious() {
  const sample = previousSamples[selectedPreviousSample];
  document.querySelectorAll(".previous-sample-tab").forEach((button, index) => {
    button.setAttribute("aria-selected", String(index === selectedPreviousSample));
  });
  document.querySelectorAll(".previous-mode-tab").forEach(button => {
    button.setAttribute("aria-selected", String(button.dataset.previousMode === selectedPreviousMode));
  });
  document.querySelector("#previous-sample-kicker").textContent =
    `POP909 · PREVIOUS SAMPLE ${String(sample.number).padStart(2,"0")}`;
  document.querySelector("#previous-sample-title").textContent = `Song ${sample.song} · Window ${sample.window}`;
  document.querySelector("#previous-stats").innerHTML = [
    stat("TEMPO", `${sample.tempo} BPM`), stat("METER", "2/4"),
    stat("MELODY", `${sample.conditionBars} bars · ${sample.melodyNotes} notes`),
    stat("GENERATED", `${sample.generatedBars} bars · ${sample.pianoNotes} notes`),
    stat("PROMPT TOKENS", sample.promptTokens), stat("GENERATED TOKENS", sample.generatedTokens),
    stat("TOTAL TOKENS", sample.promptTokens + sample.generatedTokens, true),
    stat("PITCH", `${sample.pitchMin}–${sample.pitchMax}`), stat("SEED", sample.seed)
  ].join("");
  const path = previousMidiPath(sample, selectedPreviousMode);
  const titles = {
    condition: "Given melody",
    generated: "Generated piano",
    combined: "Melody + generated piano"
  };
  document.querySelector("#previous-midi-player").src = path;
  document.querySelector("#previous-midi-visualizer").src = path;
  document.querySelector("#previous-player-title").textContent = titles[selectedPreviousMode];
  const download = document.querySelector("#previous-download-current");
  download.href = path;
  download.download = `${sample.folder}-${path.split("/").pop()}`;
  document.querySelector("#previous-generation-note").innerHTML =
    `Prompt ${sample.promptTokens} tokens + generated ${sample.generatedTokens} tokens = ` +
    `<strong>${sample.promptTokens + sample.generatedTokens}/2048 total tokens (context ceiling reached).</strong> ` +
    `<a href="assets/midi/${sample.folder}/generation-report.json">View raw report</a>`;
}

render();
renderPrevious();
