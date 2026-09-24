export async function searchArchive(query, headers) {
  const u = new URL("https://archive.org/advancedsearch.php");
  u.searchParams.set("q", "mediatype:movies AND (" + query + ")");
  u.searchParams.set("fl[]", "identifier");
  u.searchParams.set("fl[]", "title");
  u.searchParams.set("rows", "8");
  u.searchParams.set("output", "json");
  const res = await fetch(u, {headers, signal: AbortSignal.timeout(20000)});
  if (!res.ok) return [];
  const data = await res.json();
  const out = [];
  for (const doc of data.response?.docs ?? []) {
    const id = String(doc.identifier ?? "");
    if (!id) continue;
    try {
      const m = await fetch("https://archive.org/metadata/" + encodeURIComponent(id), {headers, signal: AbortSignal.timeout(15000)});
      if (!m.ok) continue;
      const meta = await m.json();
      const file = (meta.files ?? [])
        .filter(f => /\.(mp4|webm|ogv)$/i.test(String(f.name ?? "")))
        .filter(f => Number(f.size ?? 0) > 0 && Number(f.size ?? 0) <= 80000000)
        .sort((a,b) => Number(a.size ?? 0) - Number(b.size ?? 0))[0];
      if (!file) continue;
      out.push({
        title: String(doc.title ?? id) + " | " + String(file.name),
        sourcePage: "https://archive.org/details/" + id,
        imageinfo: [{
          url: "https://archive.org/download/" + id + "/" + encodeURIComponent(String(file.name)),
          mime: "video/mp4",
          size: Number(file.size ?? 0),
          mediatype: "VIDEO",
          extmetadata: {LicenseShortName: {value: String(meta.metadata?.licenseurl ?? meta.metadata?.rights ?? "See Archive.org item page")}}
        }]
      });
    } catch {}
  }
  return out;
}
