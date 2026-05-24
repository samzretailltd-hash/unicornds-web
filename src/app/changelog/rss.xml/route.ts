import { CHANGELOG, getCategoryStyle, getAreaStyle } from "@/lib/changelog";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const items = CHANGELOG.slice(0, 50).map((entry) => {
    const cat = getCategoryStyle(entry.category);
    const area = getAreaStyle(entry.area);
    const guid = `unicornds-${entry.date}-${entry.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().substring(0, 50)}`;
    const pubDate = new Date(entry.date + "T12:00:00Z").toUTCString();
    const title = `${cat.emoji} ${entry.title}`;
    const desc = `[${area.label}${entry.version ? " · " + entry.version : ""}] ${entry.description}`;
    return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>https://www.unicornds.io/changelog</link>
      <description>${escapeXml(desc)}</description>
      <category>${escapeXml(cat.label)}</category>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${guid}</guid>
    </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>UnicornDS Changelog</title>
    <link>https://www.unicornds.io/changelog</link>
    <description>What's new in UnicornDS — features, fixes, and improvements as we ship.</description>
    <language>en-GB</language>
    <atom:link href="https://www.unicornds.io/changelog/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
