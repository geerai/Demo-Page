# Qwen MIDI GitHub Pages showcase

A static research-demo website for 16 POP909 melody-conditioned piano samples.
It follows the selected-demo interaction pattern of `taste-piano.github.io`:
sample chips, metadata tags, a MIDI player, downloadable files, and a wide
piano-roll visualization.

## Preview locally

Do not open `index.html` directly because browsers restrict local MIDI fetches.
Serve the directory instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

Create an empty GitHub repository, then run inside this directory:

```bash
git init
git add .
git commit -m "Add Qwen MIDI demo site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

In the GitHub repository, open **Settings → Pages**, choose **Deploy from a
branch**, select `main` and `/ (root)`, then save. The page will appear at:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

Playback uses the browser-side `html-midi-player` bundle from jsDelivr, so the
published page needs an internet connection for its JavaScript dependencies and
piano SoundFont.
