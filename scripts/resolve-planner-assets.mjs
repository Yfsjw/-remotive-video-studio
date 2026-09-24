import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "planner-assets");
await fs.mkdir(outDir, {recursive: true});

const assets = [
  {id: "laptop", queries: ["laptop computer", "laptop", "notebook computer"], filename: "laptop.svg"},
  {id: "browser", queries: ["web browser screenshot", "web browser", "computer screen"], filename: "browser.svg"},
  {id: "page", queries: ["research paper computer screen", "computer screen", "web page"], filename: "page.svg"},
];

async function searchCommons(queries) {
  for (const query of queries) {
    const p = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url|mime|extmetadata",
      iiurlwidth: "1200",
    });
    const response = await fetch("https://commons.wikimedia.org/w/api.php?" + p, {
      headers: {
        "User-Agent": "remotive-video-studio/visual-renderer-v1 (asset resolver)",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) continue;

    const data = await response.json();
    const pages = Object.values(data?.query?.pages || {});
    const usable = pages.find((page) => {
      const info = page?.imageinfo?.[0];
      return Boolean(info?.thumburl || info?.url);
    });
    if (usable) return usable;
  }
  return null;
}

const manifest = {
  version: 2,
  provider: "Wikimedia Commons",
  generatedAt: new Date().toISOString(),
  assets: [],
};

for (const asset of assets) {
  const page = await searchCommons(asset.queries);
  if (!page) {
    throw new Error("No usable Commons image found for " + asset.id + " after trying: " + asset.queries.join(", "));
  }

  const info = page.imageinfo[0];
  const imageUrl = info.thumburl || info.url;
  const response = await fetch(imageUrl, {
    headers: {"User-Agent": "remotive-video-studio/visual-renderer-v1 (asset resolver)"},
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error("Image download failed for " + asset.id + ": " + response.status);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const mime = info.mime || "image/jpeg";
  const uri = "data:" + mime + ";base64," + bytes.toString("base64");
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">' +
    '<image href="' + uri + '" width="1200" height="900" preserveAspectRatio="xMidYMid slice"/>' +
    "</svg>";

  await fs.writeFile(path.join(outDir, asset.filename), svg);

  const meta = info.extmetadata || {};
  manifest.assets.push({
    id: asset.id,
    file: "planner-assets/" + asset.filename,
    queries: asset.queries,
    title: page.title,
    sourcePage: info.descriptionurl || null,
    license: meta.LicenseShortName?.value || null,
    artist: meta.Artist?.value || null,
  });
}

await fs.writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(JSON.stringify(manifest, null, 2));
