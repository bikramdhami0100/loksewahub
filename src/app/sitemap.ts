import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://loksewahub.vercel.app";

  const routes = [
    "",
    "/notices",
    "/vacancies",
    "/results",
    "/syllabus",
    "/notes",
    "/old-questions",
    "/ai-probable-questions",
    "/current-affairs",
    "/mock-tests",
    "/ai-tutor",
    "/pricing",
    "/contact",
    "/faq",
    "/about",
    "/dashboard",
    "/dashboard/bookmarks",
    "/dashboard/progress",
    "/dashboard/settings",
    "/admin",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["en", "ne"] as const) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "daily",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ne: `${baseUrl}/ne${route}`,
          },
        },
      });
    }
  }

  return entries;
}
