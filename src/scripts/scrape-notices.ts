import { connectDB } from "@/lib/db";
import GovernmentSource from "@/models/GovernmentSource";
import Notice from "@/models/Notice";
import * as cheerio from "cheerio";

async function scrapeSource(source: { _id: unknown; name: string; url: string }): Promise<number> {
  console.log(`Scraping: ${source.name} (${source.url})`);
  const newNotices: Array<Record<string, unknown>> = [];

  try {
    const response = await fetch(source.url, {
      headers: { "User-Agent": "LoksewaHub/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const links: Array<{ title: string; url: string }> = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href");
      const title = $(el).text().trim();
      if (!href || !title || title.length < 5) return;
      const fullUrl = href.startsWith("http") ? href : new URL(href, source.url).href;
      links.push({ title, url: fullUrl });
    });

    for (const link of links.slice(0, 50)) {
      const existing = await Notice.findOne({ originalUrl: link.url });
      if (!existing) {
        newNotices.push({
          title: link.title,
          originalUrl: link.url,
          source: source.name,
          category: "other",
          publishedDate: new Date(),
          content: "",
          isActive: true,
        });
      }
    }

    if (newNotices.length > 0) {
      await Notice.insertMany(newNotices);
    }
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
  }

  return newNotices.length;
}

export async function scrapeNotices() {
  await connectDB();
  const sources = await GovernmentSource.find({
    isActive: true,
    type: { $in: ["exam-authority", "ministry", "security"] },
  });

  let totalNew = 0;
  for (const source of sources) {
    const count = await scrapeSource(source);
    totalNew += count;
    source.lastScraped = new Date();
    await source.save();
  }

  console.log(`Scraping complete. ${totalNew} new notices found.`);
  return { sourcesScraped: sources.length, newNotices: totalNew };
}

scrapeNotices().catch(console.error);
