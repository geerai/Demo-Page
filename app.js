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
  "01_pop909_664_window-001_seed-20261013",
  "02_pop909_459_window-001_seed-20261014",
  "03_pop909_159_window-003_seed-20261015",
  "04_pop909_633_window-001_seed-20261016",
  "05_pop909_796_window-002_seed-20261017",
  "06_pop909_273_window-001_seed-20261018",
  "07_pop909_462_window-000_seed-20261019",
  "08_pop909_120_window-000_seed-20261020",
  "09_pop909_379_window-001_seed-20261021",
  "10_pop909_907_window-000_seed-20261022",
  "11_pop909_696_window-004_seed-20261023",
  "12_pop909_661_window-004_seed-20261024",
  "13_pop909_050_window-002_seed-20261025",
  "14_pop909_230_window-001_seed-20261026",
  "15_pop909_054_window-003_seed-20261027",
  "16_pop909_037_window-002_seed-20261028"
];
const modeFiles = {
  melody: ["Given melody", "condition-melody.mid"],
  chords: ["Given chord guide", "condition-chords.mid"],
  reference: ["Reference piano", "reference-piano.mid"],
  generated: ["Generated piano", "generated-piano.mid"],
  combined: ["Melody + chord guide + generated piano", "combined.mid"]
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

const archiveHost = document.querySelector("#archive-links");
previousSamples.forEach((folder, index) => {
  const link = document.createElement("a");
  link.href = `assets/midi/${folder}/combined.mid`;
  link.textContent = `Sample ${String(index + 1).padStart(2,"0")}`;
  link.title = folder;
  archiveHost.appendChild(link);
});

document.querySelectorAll(".mode-tab").forEach(button => {
  button.addEventListener("click", () => { selectedMode = button.dataset.mode; render(); });
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

render();
