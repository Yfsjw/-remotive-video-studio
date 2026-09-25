import { chromium } from "playwright";

const url = process.argv[2];
if (!url) throw new Error("Missing URL");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36" });

const links = new Set();
page.on("response", response => {
  const u = response.url();
  if (/\.mp4(?:\?|$)/i.test(u)) links.add(u);
});

await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(5000);

for (const u of await page.locator("a[href], video[src], source[src]").evaluateAll(nodes =>
  nodes.map(n => n.href || n.src).filter(Boolean)
)) {
  if (/\.mp4(?:\?|$)/i.test(u)) links.add(u);
}

console.log("MP4_CANDIDATES");
for (const u of links) console.log(u);
console.log("END_MP4_CANDIDATES");

await browser.close();
