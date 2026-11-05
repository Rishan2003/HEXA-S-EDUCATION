import research from "./research.json";
import {
  awards,
  branches,
  courses,
  gallery,
  news,
  type Branch,
  type Course,
} from "./content";
import { getVerifiedContent, type CmsRecord } from "./cms";

const string = (v: unknown, fallback = "") =>
  typeof v === "string" ? v : fallback;
const strings = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.filter((item): item is string => typeof item === "string")
    : [];
// Media records are admitted only with an approved Sanity image URL.
const image = (r: CmsRecord) => string(r.imageUrl);
const alt = (r: CmsRecord) =>
  r.image && typeof r.image === "object" && "alt" in r.image
    ? string(r.image.alt, r.title)
    : r.title;
export type StudentStory = { name: string; band: number | null; source: string; branch: string; summary: string };
const localStories: StudentStory[] = research.studentResults.map(s => ({...s, source: research.studentResultsSource, branch: "Zindabazar", summary: "Reported by HEXA’S Zindabazar; individual results are not a guarantee of future outcomes."}));
const merge = <T extends { slug: string }>(local: T[], remote: T[]): T[] => process.env.SANITY_CONTENT_MODE === "replace" ? remote : [
  ...local.filter((item) => !remote.some((r) => r.slug === item.slug)),
  ...remote,
];

/** Local evidence-reviewed content stays available; verified CMS documents add or override matching slugs. */
export async function getSiteContent() {
  const [
    remoteCourses,
    remoteBranches,
    remoteAwards,
    remoteNews,
    remoteStories,
    remoteGallery,
  ] = await Promise.all([
    getVerifiedContent<Course>("course", [], (r) => ({
      slug: r.slug.current,
      title: r.title,
      category: string(r.category),
      intro: r.summary,
      modules: strings(r.learningOutcomes),
      audience: string(
        r.audience,
        "Contact the offering branch for entry requirements and current arrangements.",
      ),
      source: r.sourceUrl,
    })),
    getVerifiedContent<Branch>("branch", [], (r) => {
      const existing = branches.find((b) => b.slug === r.slug.current);
      return {
        ...existing,
        slug: r.slug.current,
        name: r.title,
        city: string(r.city, "Sylhet"),
        address: string(r.address),
        phone: string(r.phone) || null,
        website: string(r.website, r.sourceUrl),
        sources: [r.sourceUrl],
        courses: strings(r.courseSlugs),
        note: string(r.note),
        email: string(r.email),
        testVenueAddress: string(r.testVenueAddress),
      } as Branch;
    }),
    getVerifiedContent<(typeof awards)[number]>("achievement", [], (r) => ({
      slug: r.slug.current,
      title: r.title,
      subtitle: string(r.category),
      year: typeof r.year === "number" ? String(r.year) : "",
      scope:
        r.scope === "organization"
          ? "HEXA’S Education"
          : string(r.branchTitle, "Branch recognition"),
      issuer: string(r.issuer),
      image: image(r),
      alt: alt(r),
      description: r.summary,
      evidence:
        "Editorially verified institutional record. See the original source.",
      source: r.sourceUrl,
    })),
    getVerifiedContent<(typeof news)[number]>("news", [], (r) => ({
      slug: r.slug.current,
      title: r.title,
      date: string(r.publishedAt).slice(0, 10),
      category: string(r.category, "News"),
      image: image(r),
      intro: r.summary,
      body: string(r.body, r.summary),
      source: r.sourceUrl,
    })),
    getVerifiedContent<StudentStory>("studentStory", [], (r) => ({ name: string(r.studentName, r.title), band: typeof r.band === "number" ? r.band : null, source: r.sourceUrl, branch: string(r.branchTitle), summary: r.summary })),
    getVerifiedContent<(typeof gallery)[number]>("gallery", [], (r) => ({
      title: r.title,
      image: image(r),
      category: string(r.category, "Community"),
    })),
  ]);
  return {
    courses: merge(courses, remoteCourses),
    branches: merge(branches, remoteBranches),
    awards: merge(awards, remoteAwards),
    news: merge(news, remoteNews),
    gallery: process.env.SANITY_CONTENT_MODE === "replace" ? remoteGallery : remoteGallery.length ? remoteGallery : gallery,
    studentStories: process.env.SANITY_CONTENT_MODE === "replace" ? remoteStories : remoteStories.length ? remoteStories : localStories,
  };
}
