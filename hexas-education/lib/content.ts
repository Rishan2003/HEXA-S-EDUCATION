import research from "./research.json";
export type Branch = {
  slug: string;
  name: string;
  city: string;
  address: string;
  testVenueAddress?: string;
  phone: string | null;
  email?: string;
  website: string;
  sources: string[];
  courses: string[];
  note?: string;
};
export const branches: Branch[] = research.branches;
export type Course = {
  slug: string;
  title: string;
  category: string;
  intro: string;
  modules: string[];
  audience: string;
  source: string;
};
export const courses: Course[] = [
  {
    slug: "ielts-academic",
    title: "IELTS Academic",
    category: "IELTS preparation",
    intro:
      "Develop the language skills and test familiarity to take your next academic step with confidence.",
    modules: [
      "Listening and reading strategies",
      "Academic writing practice",
      "Speaking preparation",
      "Practice and feedback",
    ],
    audience: "Learners preparing for academic study in English.",
    source: "https://hexaszindabazar.com/",
  },
  {
    slug: "ielts-on-computer",
    title: "IELTS on Computer",
    category: "IELTS preparation",
    intro:
      "Get comfortable with the computer-delivered test through focused preparation and practical familiarity.",
    modules: [
      "Computer test format",
      "Listening and reading navigation",
      "Writing on screen",
      "Speaking test preparation",
    ],
    audience: "IELTS candidates choosing the computer-delivered format.",
    source: "https://hexaszindabazar.com/",
  },
  {
    slug: "hicu",
    title: "HICU intensive preparation",
    category: "IELTS preparation",
    intro:
      "A focused preparation pathway for learners who can commit to intensive practice between classes.",
    modules: [
      "Structured daily preparation",
      "Focused language practice",
      "Test-taking techniques",
      "Independent study and feedback",
    ],
    audience:
      "Committed learners seeking an intensive study routine. Discuss the workload with your branch.",
    source: "https://hexaszindabazar.com/",
  },
  {
    slug: "ielts-life-skills",
    title: "IELTS Life Skills",
    category: "IELTS preparation",
    intro:
      "Build confidence in everyday listening and speaking for the IELTS Life Skills test.",
    modules: [
      "Everyday conversations",
      "Listening for meaning",
      "Speaking with a partner",
      "Test format familiarisation",
    ],
    audience:
      "Learners who need a Life Skills test. Confirm the required level with your receiving authority.",
    source: "https://hexasambarkhana.com/courses/",
  },
  {
    slug: "spoken-english",
    title: "Spoken English",
    category: "English language",
    intro:
      "Find your voice in English. Practise communicating clearly in everyday, academic and professional settings.",
    modules: [
      "Conversation and pronunciation",
      "Listening and responding",
      "Vocabulary in context",
      "Speaking with confidence",
    ],
    audience: "Learners who want to communicate more confidently in English.",
    source: "https://hexaszindabazar.com/",
  },
  {
    slug: "kids-english",
    title: "Kids’ English",
    category: "English language",
    intro:
      "An introduction to English that encourages young learners to participate, explore and express themselves.",
    modules: [
      "Everyday words and phrases",
      "Listening and speaking",
      "Reading foundations",
      "Interactive language practice",
    ],
    audience:
      "Young learners. Contact Zindabazar for age groups and current class arrangements.",
    source: "https://hexaszindabazar.com/",
  },
  {
    slug: "grammar-writing",
    title: "Grammar & Writing",
    category: "English language",
    intro:
      "Strengthen the foundations of clear communication with focused grammar and writing practice.",
    modules: [
      "Sentence structure",
      "Grammar in context",
      "Paragraph development",
      "Editing and clarity",
    ],
    audience: "Learners building a stronger foundation in written English.",
    source: "https://hexasambarkhana.com/courses/",
  },
  {
    slug: "basic-computer",
    title: "Basic Computer",
    category: "Digital skills",
    intro:
      "Take practical steps towards confidence with everyday computer tasks.",
    modules: [
      "Computer fundamentals",
      "Working with documents",
      "Everyday digital tools",
      "Guided practical work",
    ],
    audience: "Beginners exploring essential computer skills at Ambarkhana.",
    source: "https://hexasambarkhana.com/courses/",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    category: "Digital skills",
    intro:
      "Explore visual communication and ask the Ambarkhana team about the current design learning pathway.",
    modules: [
      "Design fundamentals",
      "Visual communication",
      "Creative tools",
      "Practical design exercises",
    ],
    audience:
      "Aspiring creatives. Confirm the current tools, syllabus and prerequisites with the branch.",
    source: "https://hexasambarkhana.com/courses/",
  },
];
export const awards = [
  {
    slug: "highest-volume-bangladesh-2026",
    title: "Highest Volume Contributor",
    subtitle: "Bangladesh · 2026",
    year: "2026",
    scope: "HEXA’S Education",
    issuer: "British Council IELTS",
    image: "/media/bangladesh-volume-award-2026.webp",
    alt: "British Council IELTS trophy engraved Highest Volume Contributor Bangladesh 2026, HEXA’S Education",
    description:
      "The supplied trophy names HEXA’S Education as Highest Volume Contributor Bangladesh 2026. Presented here with the original institutional award photography.",
    evidence: "Award title, year and recipient visible on the supplied trophy.",
    source: "",
  },
  {
    slug: "highest-growth-south-asia-2026",
    title: "Highest Growth South Asia",
    subtitle: "South Asia · 2026",
    year: "2026",
    scope: "HEXA’S Education",
    issuer: "British Council IELTS",
    image: "/media/south-asia-growth-2026.webp",
    alt: "HEXA’S representatives receiving an award beside a Highest Growth South Asia 2026 presentation",
    description:
      "A regional recognition documented in the supplied ceremony photograph and reported by HEXA’S Zindabazar.",
    evidence: "Supplied ceremony photograph and institutional report.",
    source: "https://hexaszindabazar.com/our-success/",
  },
  {
    slug: "country-top-performer",
    title: "Country Top Performer",
    subtitle: "Five-time recognition",
    year: "Five-time",
    scope: "Zindabazar · institutional report",
    issuer: "British Council IELTS",
    image: "/media/british-council-award-ceremony.webp",
    alt: "HEXA’S representatives at a British Council IELTS award ceremony",
    description:
      "Zindabazar reports five-time Country Top Performer recognition. HEXA’S confirms these were consecutive years; the exact annual award records are being consolidated.",
    evidence:
      "Branch-published five-time recognition; consecutive sequence supplied by HEXA’S. Photograph is an institutional ceremony image, not evidence for all five years.",
    source: "https://hexaszindabazar.com/our-success/",
  },
];
export const gallery = [
  {
    image: "/media/british-council-award-ceremony.webp",
    title: "A shared moment of recognition",
    category: "Recognition",
  },
  {
    image: "/media/south-asia-growth-2026.webp",
    title: "Highest Growth South Asia, 2026",
    category: "Recognition",
  },
  {
    image: "/media/volume-award-presentation-2026.webp",
    title: "Highest Volume Contributor presentation",
    category: "Recognition",
  },
  {
    image: "/media/partners-group.webp",
    title: "British Council partnership gathering",
    category: "Community",
  },
  {
    image: "/media/institutional-recognition.webp",
    title: "Institutional recognition ceremony",
    category: "Community",
  },
  {
    image: "/media/bangladesh-volume-award-2026.webp",
    title: "Highest Volume Contributor Bangladesh, 2026",
    category: "Recognition",
  },
  {
    image: "/media/recognition-team.webp",
    title: "The HEXA’S team at a partnership event",
    category: "Community",
  },
];
export const news = [
  {
    slug: "regional-recognition-2026",
    title: "HEXA’S recognised for growth across South Asia",
    date: "2026",
    category: "Recognition",
    image: "/media/south-asia-growth-2026.webp",
    intro:
      "The Highest Growth South Asia 2026 presentation marks an important moment in the HEXA’S education journey.",
    body: "The supplied ceremony image identifies the recognition as Highest Growth South Asia 2026. The recognition is also reported by the Zindabazar branch. The award gallery preserves the original image and the context in which it was supplied.",
    source: "https://hexaszindabazar.com/our-success/",
  },
  {
    slug: "bangladesh-contributor-2026",
    title: "A national recognition, a shared commitment",
    date: "2026",
    category: "Institutional news",
    image: "/media/volume-award-presentation-2026.webp",
    intro:
      "A closer look at the Highest Volume Contributor Bangladesh 2026 award.",
    body: "The British Council IELTS trophy carries the name HEXA’S Education and the title Highest Volume Contributor Bangladesh 2026. The photograph and presentation image are part of the institution’s supplied archive. This recognition is distinct from IELTS student band results.",
    source: "",
  },
  {
    slug: "choosing-your-ielts-pathway",
    title: "Find the IELTS preparation pathway that fits you",
    date: "Guide",
    category: "Learning resources",
    image: "/media/partnership-presentation.webp",
    intro:
      "Academic preparation, computer familiarity or an intensive routine: start with your learning needs.",
    body: "Choose a preparation pathway by discussing your target test, current English level and available study time with a branch adviser. Zindabazar publishes IELTS Academic, IELTS on Computer and HICU options. Preparation course admission and official IELTS test booking are separate processes. Confirm current schedules and fees directly with your chosen branch.",
    source: "https://hexaszindabazar.com/",
  },
];
export const pageTitles: Record<string, string> = {
  about: "About HEXA’S",
  achievements: "Achievements & Awards",
  courses: "Courses & Programs",
  branches: "Our Branches",
  success: "Student Success Stories",
  partnerships: "Partnerships & Affiliations",
  facilities: "Facilities & Learning",
  news: "News & Updates",
  gallery: "Gallery & Media",
  contact: "Contact & Admissions",
  privacy: "Privacy",
  bn: "হেক্সাস এডুকেশন",
};
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
