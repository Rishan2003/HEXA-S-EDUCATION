import type { MetadataRoute } from "next";
import { pageTitles, siteUrl } from "@/lib/content";
import { getSiteContent } from "@/lib/site-content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getSiteContent();
  const paths = [
    "",
    ...Object.keys(pageTitles),
    ...c.courses.map((c) => `courses/${c.slug}`),
    ...c.branches.map((b) => `branches/${b.slug}`),
    ...c.awards.map((a) => `achievements/${a.slug}`),
    ...c.news.map((n) => `news/${n.slug}`),
  ];
  return paths.map((path) => ({
    url: `${siteUrl}/${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.7 : 1,
  }));
}
