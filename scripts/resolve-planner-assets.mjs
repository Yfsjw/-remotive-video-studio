import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "planner-assets");
await fs.mkdir(outDir, {recursive: true});

const assets = [
  {id: "laptop", query: "laptop computer", filename: "laptop.svg"},
  {id: "browser", query: "web browser computer", filename: "browser.svg"},
  {id: "page", query: "research computer screen", filename: "page.svg"},
];

async function searchCommons(query) {
  const p = new URLSearchParams({
    action: "query", format: "json", formatversion: "2",
    generator: "search", gsrsearch: query, gsrnamespace: "6",
    gsrlimit: "8", prop: "imageinfo", iiprop: "url|extmetadata",
    iiurlwidth: "1200",
  });
  const r = await fetch("https://commons.wikimedia.org/w/api.php?" + p, {
    headers: {"User-Agent": "remotive-video-studio/visual-renderer-v1"},
  });
  if (!r.ok) throw new Error("Commons API failed: " + r.status);
  const data = await r.json();
  const pages = data?.query?.pages || [];
  return pages.find((x) => x.imageinfo?.[0]?.thumburl && /^image\//.test(x.imageinfo[0].mime || ""));
}

const manifest = {version: 1, provider: "Wikimedia Commons", generatedAt: new Date().toISOString(), assets: []};

for (const asset of assets) {
  const page = await searchCommons(asset.query);
  if (!page) throw new Error("No usable Commons image found for " + asset.id);
  const info = page.imageinfo[0];
  const r = await fetch(info.thumburl, {headers: {"User-Agent": "remotive-video-studio/visual-renderer-v1"}});
  if (!r.ok) throw new Error("Image download failed for " + asset.id + ": " + r.status);
  const bytes = Buffer.from(await r.arrayBuffer());
  const uri = "data:" + (info.mime || "image/jpeg") + ";base64," + bytes.toString("base64");
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"><image href="' + uri + '" width="1200" height="900" preserveAspectRatio="xMidYMid slice"/></svg>';
  await fs.writeFile(path.join(outDir, asset.filename), svg);
  const meta = info.extmetadata || {};
  manifest.assets.push({
    id: asset.id, file: "planner-assets/" + asset.filename, query: asset.query,
    title: page.title, sourcePage: info.descriptionurl,
    license: meta.LicenseShortName?.value || null,
    artist: meta.Artist?.value || null,
  });
}
await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
