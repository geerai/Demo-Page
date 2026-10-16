# Qwen MIDI GitHub Pages showcase

A static research-demo website for 10 POP909/POP909-CL key-, chord-, and
melody-conditioned piano samples. The previous 16 melody-conditioned samples
remain linked as a comparison archive.
It follows the selected-demo interaction pattern of `taste-piano.github.io`:
sample chips, metadata tags, a MIDI player, downloadable files, and a wide
piano-roll visualization.

The current REMI sampling results are shown without filtering: all 10 MIDI
outputs are playable, while their reports identify incomplete generated
structures (primarily because generation reached the 2,048-token context
limit). This is surfaced directly in the interface.

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
