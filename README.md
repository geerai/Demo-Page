# Qwen MIDI GitHub Pages showcase

A static research-demo website comparing the same 10 POP909/POP909-CL key-,
chord-, and melody-conditioned piano prompts at the V1 checkpoint and after a
2,000-step continuation. The previous 16 melody-conditioned samples remain
linked as a separate archive.
It follows the selected-demo interaction pattern of `taste-piano.github.io`:
sample chips, metadata tags, a MIDI player, downloadable files, and a wide
piano-roll visualization.

Both REMI sampling runs are shown without filtering. The Step-2000 run improves
mean bar completion from 68.1% to 81.4% and reduces bar-sequence errors from 9
to 1, but neither run has a strictly grammar-valid sample. The interface makes
this mixed result explicit and exposes raw generation and comparison reports.

## Preview locally

Do not open `index.html` directly because browsers restrict local MIDI fetches.
Serve the directory instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Repository and GitHub Pages

Repository:

```text
https://github.com/geerai/Demo-Page
```

Once GitHub Pages is configured to deploy from `main` and `/ (root)`, the site
is available at:

```text
https://geerai.github.io/Demo-Page/
```

Playback uses the browser-side `html-midi-player` bundle from jsDelivr, so the
published page needs an internet connection for its JavaScript dependencies and
piano SoundFont.
