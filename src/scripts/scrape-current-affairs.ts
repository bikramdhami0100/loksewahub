import { connectDB } from "@/lib/db";
import CurrentAffair from "@/models/CurrentAffair";
import * as cheerio from "cheerio";

function classifyCategory(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  if (text.includes("budget") || text.includes("अर्थ") || text.includes("economy") || text.includes("finance")) return "economy";
  if (text.includes("sports") || text.includes("खेल") || text.includes("क्रिकेट")) return "sports";
  if (text.includes("award") || text.includes("पुरस्कार") || text.includes("सम्मान")) return "award";
  if (text.includes("appoint") || text.includes("नियुक्ति") || text.includes("promotion")) return "appointment";
  if (text.includes("disaster") || text.includes("भूकम्प") || text.includes("बाढी") || text.includes("flood")) return "disaster";
  if (text.includes("science") || text.includes("विज्ञान") || text.includes("technology") || text.includes("space")) return "science";
  if (text.includes("international") || text.includes("अन्तर्राष्ट्रिय") || text.includes("world") || text.includes("un")) return "international";
  if (text.includes("politics") || text.includes("राजनीति") || text.includes("सरकार") || text.includes("government")) return "politics";
  return "other";
}

const SOURCES = [
  { name: "Gorkhapatra Online", url: "https://gorkhapatraonline.com" },
  { name: "The Rising Nepal", url: "https://risingnepaldaily.com" },
];

async function scrapeGorkhapatra(): Promise<Array<{ title: string; url: string; content: string }>> {
  const response = await fetch("https://gorkhapatraonline.com", {
    headers: { "User-Agent": "LoksewaHub/1.0" },
    signal: AbortSignal.timeout(15000),
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const articles: Array<{ title: string; url: string; content: string }> = [];

  $(".blog-box-layout1").each((_, el) => {
    const link = $(el).find("h2.item-title a, h3 a");
    const href = link.attr("href");
    const title = link.text().trim();
    if (title && href) {
      const pText = $(el).find("p").text().trim();
      articles.push({
        title,
        url: href.startsWith("http") ? href : `https://gorkhapatraonline.com${href}`,
        content: pText || title,
      });
    }
  });

  return articles;
}

async function scrapeRisingNepal(): Promise<Array<{ title: string; url: string; content: string }>> {
  const response = await fetch("https://risingnepaldaily.com", {
    headers: { "User-Agent": "LoksewaHub/1.0" },
    signal: AbortSignal.timeout(15000),
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const articles: Array<{ title: string; url: string; content: string }> = [];

  $("h3").each((_, el) => {
    const link = $(el).find("a");
    const href = link.attr("href");
    const title = link.text().trim();
    if (title && href && href !== "#") {
      articles.push({
        title,
        url: href.startsWith("http") ? href : `https://risingnepaldaily.com${href}`,
        content: title,
      });
    }
  });

  return articles;
}

export async function scrapeCurrentAffairs() {
  await connectDB();
  let totalNew = 0;

  const scrapers = [
    { name: "Gorkhapatra Online", fn: scrapeGorkhapatra },
    { name: "The Rising Nepal", fn: scrapeRisingNepal },
  ];

  for (const { name, fn } of scrapers) {
    try {
      const articles = await fn();
      for (const article of articles.slice(0, 20)) {
        const existing = await CurrentAffair.findOne({ sourceUrl: article.url });
        if (!existing) {
          await CurrentAffair.create({
            title: article.title,
            content: article.content,
            summary: article.content.slice(0, 200),
            category: classifyCategory(article.title, article.content),
            source: name,
            sourceUrl: article.url,
            date: new Date(),
            isPublished: true,
          });
          totalNew++;
        }
      }
    } catch (error) {
      console.error(`Error scraping ${name}:`, error);
    }
  }

  console.log(`Scraped ${totalNew} new current affairs.`);
  return { sourcesScraped: scrapers.length, newItems: totalNew };
}

scrapeCurrentAffairs().catch(console.error);
