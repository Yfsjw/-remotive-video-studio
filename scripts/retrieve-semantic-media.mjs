import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MEDIA = join(ROOT, "public/media");
mkdirSync(MEDIA, { recursive: true });

const beats = [
  { id: "hook", query: "person using laptop technology work", caption: "Most AI videos explain the idea. They rarely show it.", type: "human-action" },
  { id: "model", query: "video editing computer timeline editing", caption: "The fix is simple: edit in shots, not slides.", type: "process" },
  { id: "narration", query: "person speaking microphone studio podcast", caption: "Start with the narration.", type: "human-action" },
  { id: "intent", query: "computer screen software interface programming", caption: "Then ask: what should the viewer actually see?", type: "screen" },
  { id: "concrete", query: "close up computer keyboard hands technology", caption: "Not a circle. Not a card. A real visual.", type: "close-up" },
  { id: "transition", query: "city street moving traffic technology", caption: "A change of place can carry a transition.", type: "environment" },
  { id: "detail", query: "server room computer hardware close up", caption: "A close-up can make the idea feel concrete.", type: "detail" },
  { id: "rhythm", query: "camera operator filmmaking production", caption: "Then cut again before the image becomes wallpaper.", type: "production" },
  { id: "graphic", query: "computer display data visualization screen", caption: "Graphics still matter. But they explain what footage cannot.", type: "screen" },
  { id: "ending", query: "technology city night network computer", caption: "The timeline becomes a sequence of decisions.", type: "environment" }
];

const headers = {
  "User-Agent": "RemotiveVideoStudio/0.1 (GitHub Actions; media retrieval test)",
  "Accept": "application/json"
};

async function searchCommons(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query + " filetype:video");
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "30");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|size|duration|extmetadata");
  const res = await fetch(url, { headers: headers });
  if (!res.ok) throw new Error("Commons search failed: " + res.status);
  const data = await res.json();
  return Object.values(data.query?.pages ?? {});
}

function titleOf(item) {
  return String(item.title ?? "").replace(/^File:/, "");
}

function score(item, query) {
  const title = titleOf(item).toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter(x => x.length > 3);
  return terms.reduce((n, t) => n + (title.includes(t) ? 3 : 0), 0);
}

function pick(items, query, used) {
  return items
    .filter(x => {
      const ii = x.imageinfo?.[0];
      return ii &&
        String(ii.mime || "").startsWith("video/") &&
        Number(ii.size || 0) > 0 &&
        Number(ii.size || 0) <= 180_000_000 &&
        Number(ii.duration || 0) >= 4 &&
        ii.url &&
        !used.has(titleOf(x));
    })
    .sort((a, b) => score(b, query) - score(a, query))[0] ?? null;
}

function safeName(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

async function main() {
  const used = new Set();
  const selected = [];

  for (const beat of beats) {
    const candidates = await searchCommons(beat.query);
    const item = pick(candidates, beat.query, used);
    if (!item) {
      console.error("No distinct usable video found for:", beat.query);
      continue;
    }
    const ii = item.imageinfo[0];
    used.add(titleOf(item));
    selected.push({
      ...beat,
      title: titleOf(item),
      url: ii.url,
      license: ii.extmetadata?.LicenseShortName?.value ?? "See Wikimedia Commons file page",
      sourcePage: "https://commons.wikimedia.org/wiki/" + encodeURIComponent(item.title.replace(/ /g, "_"))
    });
  }

  if (selected.length < 7) {
    throw new Error(`Media retrieval produced only ${selected.length} distinct usable sources; refusing to render a fake/repetitive visual test. Need at least 7.`);
  }

  const shots = [];
  const frameDurations = [78, 84, 78, 84, 78, 90, 84, 90, 102, 132];
  let from = 0;

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const asset = selected[i] ?? selected[(i - 1) % selected.length];
    const duration = frameDurations[i];
    const sourceIndex = selected.indexOf(asset);
    const filename = `${String(i + 1).padStart(2, "0")}-${safeName(asset.title)}.mp4`;
    shots.push({
      ...beat,
      from,
      duration,
      trim: 0,
      src: "media/" + filename,
      assetTitle: asset.title,
      assetUrl: asset.url,
      sourcePage: asset.sourcePage,
      license: asset.license,
      sourceIndex
    });
    from += duration;
  }

  if (from !== 900) throw new Error("Shot plan must total exactly 900 frames, got " + from);

  const manifest = [];
  for (const shot of shots) {
    const target = join(MEDIA, shot.src.replace(/^media\//, ""));
    const tmp = target.replace(/\.mp4$/, ".source");
    if (existsSync(target)) unlinkSync(target);
    console.log("Downloading:", shot.assetTitle);
    execFileSync("curl", ["-L", "--fail", "--retry", "3", "--max-time", "90", shot.assetUrl, "-o", tmp], { stdio: "inherit" });
    execFileSync("ffmpeg", ["-y", "-i", tmp, "-t", "14", "-vf", "scale=1920:-2:flags=lanczos,fps=30", "-an", "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", target], { stdio: "inherit" });
    unlinkSync(tmp);
    manifest.push({ file: shot.src, title: shot.assetTitle, sourcePage: shot.sourcePage, license: shot.license });
  }

  writeFileSync(join(ROOT, "public/media-manifest.json"), JSON.stringify(manifest, null, 2));
  writeFileSync(join(ROOT, "src/generatedShots.ts"), "export const generatedShots = " + JSON.stringify(shots, null, 2) + " as const;\n");
  console.log("Generated", shots.length, "semantic shots from", selected.length, "distinct Commons video sources.");
}

main().catch(err => { console.error(err); process.exit(1); });
