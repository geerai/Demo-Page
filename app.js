const samples = [
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
  number, song, window, seed, tempo, conditionBars, generatedBars, melodyNotes,
  pianoNotes, pitchMin, pitchMax, promptTokens, generatedTokens,
  folder: `${String(number).padStart(2,"0")}_pop909_${song}_window-${window}_seed-${seed}`
}));

const colors = ["#5aa89f","#d4a53c","#8a63b8","#55a69f","#5276a9","#c36b55"];
const modeFiles = {
  condition: ["Given melody", "condition.mid"],
  generated: ["Generated piano", "generated-piano.mid"],
  combined: ["Melody + generated piano", "combined.mid"]
};
let selectedSample = 0;
let selectedMode = "combined";

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

document.querySelectorAll(".mode-tab").forEach(button => {
  button.addEventListener("click", () => { selectedMode = button.dataset.mode; render(); });
});

function midiPath(sample, mode) {
  return `assets/midi/${sample.folder}/${modeFiles[mode][1]}`;
}

function stat(label, value) {
  return `<span class="stat"><b>${label}</b>${value}</span>`;
}

function render() {
  const sample = samples[selectedSample];
  document.querySelectorAll(".sample-tab").forEach((button, index) => {
    button.setAttribute("aria-selected", String(index === selectedSample));
  });
  document.querySelectorAll(".mode-tab").forEach(button => {
    button.setAttribute("aria-selected", String(button.dataset.mode === selectedMode));
  });
  document.querySelector("#sample-kicker").textContent = `POP909 · SAMPLE ${String(sample.number).padStart(2,"0")}`;
  document.querySelector("#sample-title").textContent = `Song ${sample.song} · Window ${sample.window}`;
  document.querySelector("#stats").innerHTML = [
    stat("TEMPO", `${sample.tempo} BPM`), stat("METER", "2/4"),
    stat("MELODY", `${sample.conditionBars} bars · ${sample.melodyNotes} notes`),
    stat("PIANO", `${sample.generatedBars} bars · ${sample.pianoNotes} notes`),
    stat("PITCH", `${sample.pitchMin}–${sample.pitchMax}`), stat("SEED", sample.seed)
  ].join("");
  const path = midiPath(sample, selectedMode);
  player.src = path;
  visualizer.src = path;
  document.querySelector("#player-title").textContent = modeFiles[selectedMode][0];
  const download = document.querySelector("#download-current");
  download.href = path;
  download.download = `${sample.folder}-${modeFiles[selectedMode][1]}`;
  document.querySelector("#generation-note").textContent =
    `Prompt ${sample.promptTokens} tokens · Generated ${sample.generatedTokens} tokens · Context ceiling reached at 2,048 tokens.`;
}

render();
