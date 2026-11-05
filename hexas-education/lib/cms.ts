import "server-only";
import { z } from "zod";

export const contentTypes = [
  "course",
  "branch",
  "achievement",
  "news",
  "gallery",
  "studentStory",
] as const;
export type ContentType = (typeof contentTypes)[number];
const baseRecord = z
  .object({
    _id: z.string(),
    _type: z.enum(contentTypes),
    title: z.string(),
    slug: z.object({ current: z.string() }),
    summary: z.string(),
    verificationStatus: z.literal("verified"),
    sourceUrl: z.string().url(),
    language: z.enum(["en", "bn"]).default("en"),
  })
  .passthrough();
export type CmsRecord = z.infer<typeof baseRecord>;

/** Return published, editorially verified documents; fall back safely on missing configuration or service failure. */
export async function getVerifiedContent<T>(
  type: ContentType,
  fallback: T[],
  adapt: (document: CmsRecord) => T,
  language: "en" | "bn" = "en",
): Promise<T[]> {
  const project = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (
    !project ||
    !dataset ||
    !/^[a-z0-9]+$/.test(project) ||
    !/^[a-zA-Z0-9_-]+$/.test(dataset)
  )
    return fallback;
  const query =
    '*[_type == $type && verificationStatus == "verified" && language == $language && (_type != "studentStory" || (consentConfirmed == true && resultVerified == true)) && (!(_type in ["achievement", "news", "gallery"]) || (defined(image.asset) && image.rightsConfirmed == true)) && (_type != "branch" || active == true) && !(_id in path("drafts.**"))] | order(order asc, title asc) {..., "imageUrl": image.asset->url, "branchTitle": branch->title, "courseSlugs": *[_type == "course" && verificationStatus == "verified" && references(^._id)].slug.current}';
  const url = new URL(
    `https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);
  url.searchParams.set("$type", JSON.stringify(type));
  url.searchParams.set("$language", JSON.stringify(language));
  url.searchParams.set("perspective", "published");
  try {
    const response = await fetch(url, {
      headers: process.env.SANITY_READ_TOKEN
        ? { Authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` }
        : {},
      next: { revalidate: 300, tags: ["cms", type] },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return fallback;
    const body = (await response.json()) as { result?: unknown };
    const parsed = z.array(baseRecord).safeParse(body.result);
    if (!parsed.success) return fallback;
    // An empty published collection is intentional; only failures use bundled content.
    return parsed.data.filter(r => {
      if (type === "studentStory") return r.consentConfirmed === true && r.resultVerified === true;
      if (["achievement", "news", "gallery"].includes(type)) return typeof r.imageUrl === "string" && r.imageUrl.startsWith("https://cdn.sanity.io/") && !!r.image && typeof r.image === "object" && "rightsConfirmed" in r.image && r.image.rightsConfirmed === true;
      return true;
    }).map(adapt);
  } catch {
    return fallback;
  }
}
