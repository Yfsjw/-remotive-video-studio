import fs from "node:fs/promises";
import path from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";

const exec = promisify(execFile);
const outDir = path.join(process.cwd(), "public", "planner-assets");
await fs.mkdir(outDir, {recursive: true});

const assets = [
  {id:"hero-person-laptop", queries:["person using laptop technology","person working laptop computer","laptop workspace"], filename:"hero-person-laptop.jpg"},
  {id:"hands-keyboard", queries:["hands typing laptop keyboard","typing on laptop computer","computer keyboard hands"], filename:"hands-keyboard.jpg"},
  {id:"web-search", queries:["web browser computer screen","search engine computer screen","internet research computer"], filename:"web-search.jpg"},
  {id:"research-paper", queries:["research paper desk computer","scientist reading research paper","research documents computer"], filename:"research-paper.jpg"},
  {id:"data-analysis", queries:["data analysis computer screen","data visualization laptop","computer data analysis"], filename:"data-analysis.jpg"},
  {id:"ai-computer", queries:["artificial intelligence computer","AI technology computer screen","machine learning computer"], filename:"ai-computer.jpg"},
  {id:"robot-human-computer", queries:["human robot computer technology","robot hand computer","human computer interaction technology"], filename:"robot-human-computer.jpg"},
  {id:"technology-workspace", queries:["modern technology workspace laptop","computer workspace technology","digital workspace computer"], filename:"technology workspace computer"], filename:"technology-workspace.jpg"},
];

function clean(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim();
}

function scoreResult(item, query) {
  const title = clean(item.title).toLowerCase();
  const tags = (item.tags || []).map(t => clean(t?.name || t).toLowerCase()).join(" ");
  const text = title + " " + tags;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const term of terms) if (text.includes(term)) score += 3;
  if ((item.width || 0) >= 1400) score += 2;
  if ((item.height || 0) >= 900) score += 1;
  if (item.watermarked) score -= 20;
  if (/logo|icon|clipart|illustration|diagram|screenshot|poster|banner/.test(text)) score -= 7;
  return score;
}

async function searchOpenverse(queries) {
  const candidates = [];
  for (const query of queries) {
    const url = new URL("https://api.openverse.org/v1/images/");
    url.searchParams.set("q", query);
    url.searchParams.set("page_size", "20");
    url.searchParams.set("license_type", "commercial");
    url.searchParams.set("mature", "false");
    const response = await fetch(url, {
      headers: {"User-Agent":"remotive-video-studio/visual-assets-v2 (asset resolver)","Accept":"application/json"},
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) continue;
    const data = await response.json();
    for (const item of data.results || []) {
      const usable = item.url && item.thumbnail && (item.width || 0) >= 900 && (item.height || 0) >= 600;
      if (usable) candidates.push({...item, _score: scoreResult(item, query)});
    }
  }
  candidates.sort((a,b) => b._score - a._score);
  const seen = new Set();
  return candidates.find(item => {
    const key = item.url || item.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }) || null;
}

const manifest = {
  version: 3,
  provider: "Openverse",
  generatedAt: new Date().toISOString(),
  licensePolicy: "commercial-compatible results requested; verify individual licenses before publication",
  assets: [],
};

for (const asset of assets) {
  const item = await searchOpenverse(asset.queries);
  if (!item) throw new Error("No suitable Openverse image found for " + asset.id);

  const sourcePath = path.join(outDir, asset.id + ".source");
  const outputPath = path.join(outDir, asset.filename);
  const response = await fetch(item.url, {
    headers: {"User-Agent":"remotive-video-studio/visual-assets-v2 (asset resolver)"},
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Image download failed for " + asset.id + ": " + response.status);
  await fs.writeFile(sourcePath, Buffer.from(await response.arrayBuffer()));

  await exec("ffmpeg", [
    "-y","-loglevel","error","-i",sourcePath,
    "-vf","scale=1600:1600:force_original_aspect_ratio=decrease",
    "-q:v","2",outputPath
  ]);
  await fs.unlink(sourcePath);

  manifest.assets.push({
    id: asset.id,
    file: "planner-assets/" + asset.filename,
    queries: asset.queries,
    title: clean(item.title),
    source: item.source || null,
    sourcePage: item.foreign_landing_url || null,
    license: item.license || null,
    licenseVersion: item.license_version || null,
    creator: clean(item.creator),
    width: item.width || null,
    height: item.height || null,
  });
}

await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
