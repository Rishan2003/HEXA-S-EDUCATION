import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Action, PageHero, Photo, Source, Eyebrow } from "@/components/ui";
import { CourseDirectory, Gallery, Journey } from "@/components/interactive";
import { InquiryForm } from "@/components/inquiry-form";
import { pageTitles, siteUrl } from "@/lib/content";
import research from "@/lib/research.json";
import { getSiteContent } from "@/lib/site-content";
export const revalidate = 300;
type Props = { params: Promise<{ slug?: string[] }> };
export async function generateStaticParams() {
  const c = await getSiteContent();
  return [
    ...Object.keys(pageTitles).map((s) => ({ slug: [s] })),
    ...c.courses.map((c) => ({ slug: ["courses", c.slug] })),
    ...c.branches.map((b) => ({ slug: ["branches", b.slug] })),
    ...c.awards.map((a) => ({ slug: ["achievements", a.slug] })),
    ...c.news.map((n) => ({ slug: ["news", n.slug] })),
  ];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const c = await getSiteContent();
  const section = slug[0];
  const detail = slug[1];
  const title = detail
    ? section === "courses"
      ? c.courses.find((x) => x.slug === detail)?.title
      : section === "branches"
        ? c.branches.find((x) => x.slug === detail)?.name
        : section === "achievements"
          ? c.awards.find((x) => x.slug === detail)?.title
          : c.news.find((x) => x.slug === detail)?.title
    : pageTitles[section];
  return {
    title: title || "Page not found",
    description: `${title || "Explore HEXA’S"} — programs, institutional information and branch guidance from HEXA’S Education Bangladesh.`,
    alternates: { canonical: `/${slug.join("/")}` },
  };
}
function Crumbs({ section, title }: { section: string; title: string }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      <Link href={`/${section}`}>{pageTitles[section]}</Link>
      <span>/</span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}
function JsonLd({ value }: { value: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const [section, detail] = slug;
  const { courses, branches, awards, news, gallery, studentStories } = await getSiteContent();
  if (slug.length > 2 || !pageTitles[section]) notFound();
  if (detail) {
    const breadcrumb = (title: string) => (
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            {
              "@type": "ListItem",
              position: 2,
              name: pageTitles[section],
              item: `${siteUrl}/${section}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: title,
              item: `${siteUrl}/${section}/${detail}`,
            },
          ],
        }}
      />
    );
    if (section === "courses") {
      const course = courses.find((c) => c.slug === detail);
      if (!course) notFound();
      const offered = branches.filter((b) => b.courses.includes(course.slug));
      return (
        <>
          {breadcrumb(course.title)}
          <JsonLd
            value={{
              "@context": "https://schema.org",
              "@type": "Course",
              name: course.title,
              description: course.intro,
              provider: {
                "@type": "EducationalOrganization",
                name: "HEXA’S Education Bangladesh",
                url: siteUrl,
              },
            }}
          />
          <PageHero
            label={course.category}
            title={course.title}
            intro={course.intro}
          />
          <section className="wrap inner-section">
            <Crumbs section={section} title={course.title} />
            <div className="two-col">
              <article className="prose">
                <Eyebrow>Build your next chapter</Eyebrow>
                <h2>A pathway built around your goal.</h2>
                <p>{course.audience}</p>
                <h3>What to discuss with your adviser</h3>
                <ul>
                  {course.modules.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <p className="notice">
                  These learning themes are a guide. Your branch will confirm
                  the current syllabus, entry level, class format, duration and
                  fees before enrollment.
                </p>
                <h3>Your next steps</h3>
                <ol>
                  <li>Choose an offering branch below.</li>
                  <li>Discuss your target and current level with the team.</li>
                  <li>
                    Confirm the current course details and enrollment process.
                  </li>
                </ol>
                <Source href={course.source}>
                  View published program information
                </Source>
              </article>
              <aside className="info-panel">
                <p className="small-label">Published offering locations</p>
                <h3>Find your branch</h3>
                {offered.map((b) => (
                  <div key={b.slug} style={{ marginBottom: 25 }}>
                    <Link className="text-link" href={`/branches/${b.slug}`}>
                      {b.name} ↗
                    </Link>
                    <p style={{ marginTop: 10 }}>{b.address}</p>
                  </div>
                ))}
                {!offered.length && (
                  <p>
                    Contact the admissions team to confirm current offering
                    locations.
                  </p>
                )}
                <Action href="/contact">Ask about this program</Action>
                <p style={{ marginTop: 25 }}>
                  Course admission is separate from official examination
                  registration. No batch availability or fees are implied.
                </p>
              </aside>
            </div>
          </section>
        </>
      );
    }
    if (section === "branches") {
      const branch = branches.find((b) => b.slug === detail);
      if (!branch) notFound();
      return (
        <>
          {breadcrumb(branch.name)}
          <PageHero
            label={`${branch.city} · Branch directory`}
            title={`HEXA’S ${branch.name}`}
            intro={branch.address}
          />
          <section className="wrap inner-section">
            <Crumbs section={section} title={branch.name} />
            <div className="two-col">
              <article className="prose">
                <h2>Your local starting point.</h2>
                <p>
                  Connect with the {branch.name} team for branch-specific
                  information. Confirm office hours and the right location
                  before travelling.
                </p>
                <dl className="fact-list">
                  <div>
                    <dt>City</dt>
                    <dd>{branch.city}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      {branch.phone ? (
                        <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                      ) : (
                        "See official venue listing"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>{branch.address}</dd>
                  </div>
                  <div>
                    <dt>Website</dt>
                    <dd>
                      <a
                        href={branch.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official branch / venue information ↗
                      </a>
                    </dd>
                  </div>
                </dl>
                {branch.testVenueAddress && (
                  <>
                    <h3>IELTS test venue</h3>
                    <p>{branch.testVenueAddress}</p>
                    <p className="notice">
                      The test venue and admissions office may be on different
                      floors. Follow the location on your official test
                      confirmation.
                    </p>
                  </>
                )}
                {branch.note && <p>{branch.note}</p>}
                <a
                  className="action outline"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open map directions <span className="action-arrow">↗</span>
                </a>
                <div>
                  {branch.sources.map((s) => (
                    <div key={s}>
                      <Source href={s} />
                    </div>
                  ))}
                </div>
              </article>
              <aside className="info-panel">
                <h3>Programs at this location</h3>
                {branch.courses.length ? (
                  branch.courses.map((s) => {
                    const c = courses.find((c) => c.slug === s);
                    return c ? (
                      <p key={s}>
                        <Link className="text-link" href={`/courses/${s}`}>
                          {c.title} ↗
                        </Link>
                      </p>
                    ) : null;
                  })
                ) : (
                  <p>
                    Preparation course listings are awaiting branch
                    confirmation. The official listing verifies the location; it
                    does not establish current preparation course availability.
                  </p>
                )}
                <Action href="/contact">Contact admissions</Action>
              </aside>
            </div>
          </section>
        </>
      );
    }
    if (section === "achievements") {
      const award = awards.find((a) => a.slug === detail);
      if (!award) notFound();
      return (
        <>
          {breadcrumb(award.title)}
          <PageHero
            label={`${award.issuer} · ${award.year}`}
            title={award.title}
            intro={award.subtitle}
          />
          <section className="wrap inner-section">
            <Crumbs section={section} title={award.title} />
            <div className="two-col">
              <Photo src={award.image} alt={award.alt} className="contain" />
              <article className="prose">
                <Eyebrow>{award.scope}</Eyebrow>
                <h2>A milestone in the HEXA’S journey.</h2>
                <p>{award.description}</p>
                <h3>The recognition record</h3>
                <dl className="fact-list">
                  <div>
                    <dt>Issuing organization</dt>
                    <dd>{award.issuer}</dd>
                  </div>
                  <div>
                    <dt>Recipient / scope</dt>
                    <dd>{award.scope}</dd>
                  </div>
                  <div>
                    <dt>Year / record</dt>
                    <dd>{award.year}</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>{award.evidence}</dd>
                  </div>
                </dl>
                <Source href={award.source} />
                <p className="notice">
                  Institutional recognition is presented with its documented
                  scope. It is not a guarantee of an individual student’s test
                  result.
                </p>
                <Action href="/gallery" outline>
                  Explore the archive
                </Action>
              </article>
            </div>
          </section>
        </>
      );
    }
    if (section === "news") {
      const item = news.find((n) => n.slug === detail);
      if (!item) notFound();
      return (
        <>
          {breadcrumb(item.title)}
          <PageHero
            label={`${item.date} · ${item.category}`}
            title={item.title}
            intro={item.intro}
          />
          <article className="wrap inner-section prose">
            <Crumbs section={section} title={item.title} />
            <Photo src={item.image} alt={item.title} />
            <div style={{ maxWidth: 800, margin: "45px auto" }}>
              <p>{item.body}</p>
              <Source href={item.source} />
              <div style={{ marginTop: 30 }}>
                <Action href="/news" outline>
                  More from HEXA’S
                </Action>
              </div>
            </div>
          </article>
        </>
      );
    }
    notFound();
  }
  switch (section) {
    case "about":
      return (
        <>
          <PageHero
            label="An educational journey since 2007"
            title="Rooted in learning. Looking forward."
            intro="A belief in education, a connection to community, and the confidence to take the next step."
          />
          <section className="wrap inner-section">
            <div className="two-col">
              <Photo
                src="/media/institutional-recognition.webp"
                alt="HEXA’S representatives receiving an institutional recognition"
              />
              <article className="prose">
                <h2>
                  From Bangladesh.
                  <br />
                  <em>With possibility.</em>
                </h2>
                <p>
                  HEXA’S institutional history traces its beginnings to 2007 in
                  Bangladesh, founded by Jahed Ahmed. English language education
                  remains central to its educational identity.
                </p>
                <p>
                  Today, the Bangladesh network brings together branch teams
                  offering English language and IELTS preparation pathways. This
                  directory presents locations supported by published sources,
                  with each branch’s courses and contacts kept distinct.
                </p>
                <p>
                  The related HEXA’S USA story began in Michigan in 2020. Its
                  services and operations are separate from the Bangladesh
                  learning pathways presented here.
                </p>
                <Source href="https://www.hexasusa.com/discover-hexas">
                  Read the published institutional history
                </Source>
              </article>
            </div>
            <div className="learning-highlights">
              <div>
                <span>OUR PURPOSE</span>
                <h3>Learning that opens doors</h3>
                <p>
                  Help learners develop the confidence and skills to pursue
                  their next opportunity.
                </p>
              </div>
              <div>
                <span>OUR APPROACH</span>
                <h3>A clear next step</h3>
                <p>
                  Connect learners with program information and the branch team
                  closest to their needs.
                </p>
              </div>
              <div>
                <span>OUR COMMITMENT</span>
                <h3>Clarity and trust</h3>
                <p>
                  Present achievements with their evidence, and course
                  information with its local context.
                </p>
              </div>
            </div>
          </section>
          <section className="journey-section section">
            <div className="wrap">
              <Eyebrow>Milestones</Eyebrow>
              <h2>
                A journey,<em> still unfolding.</em>
              </h2>
              <Journey />
            </div>
          </section>
        </>
      );
    case "courses":
      return (
        <>
          <PageHero
            label="Programs & pathways"
            title="Where ambition finds direction."
            intro="Explore IELTS preparation, English language learning and digital skills. Confirm current course details with the offering branch."
          />
          <section className="wrap inner-section">
            <CourseDirectory items={courses} />
          </section>
        </>
      );
    case "branches":
      return (
        <>
          <PageHero
            label="Our learning network"
            title="Your next chapter. Closer to home."
            intro="Explore published HEXA’S locations, branch contacts and official test venue information."
          />
          <section className="wrap inner-section">
            <div className="branch-cards">
              {branches.map((b) => (
                <article key={b.slug} className="branch-card">
                  <Eyebrow>{b.city}</Eyebrow>
                  <h2>{b.name}</h2>
                  <p>{b.address}</p>
                  {b.phone && (
                    <p>
                      <a href={`tel:${b.phone}`}>{b.phone}</a>
                    </p>
                  )}
                  <Link className="text-link" href={`/branches/${b.slug}`}>
                    Explore this location ↗
                  </Link>
                </article>
              ))}
            </div>
            <p className="notice">
              This is a directory of locations supported by published sources,
              not a claimed total of the HEXA’S network. Check the branch page
              for admissions office and examination venue distinctions.
            </p>
          </section>
        </>
      );
    case "achievements":
      return (
        <>
          <PageHero
            label="Recognition & milestones"
            title="A commitment recognised."
            intro="National and regional recognition, presented with original institutional photography and the context behind each award."
          />
          <section className="wrap inner-section awards-grid">
            {awards.map((a) => (
              <article className="award-detail" key={a.slug}>
                <Photo src={a.image} alt={a.alt} />
                <div>
                  <Eyebrow>
                    {a.year} · {a.issuer}
                  </Eyebrow>
                  <h2>{a.title}</h2>
                  <p>{a.description}</p>
                  <p style={{ marginTop: 20 }}>{a.scope}</p>
                  <Link className="text-link" href={`/achievements/${a.slug}`}>
                    Explore the recognition record ↗
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </>
      );
    case "success":
      return (
        <>
          <PageHero
            label="Student journeys"
            title="Individual ambition. Personal progress."
            intro="Explore IELTS results published by HEXA’S Zindabazar, with clear attribution to the reporting branch."
          />
          <section className="wrap inner-section">
            <div className="result-list">
              {studentStories.map((s) => (
                <div key={s.name}>
                  <strong>{s.band?.toFixed(1) || "→"}</strong>
                  <p>OVERALL IELTS BAND</p>
                  <h2>{s.name}</h2>
                  <p>{s.branch}</p><p>{s.summary}</p><Source href={s.source}>Original record</Source>
                </div>
              ))}
            </div>
            <Source href={research.studentResultsSource}>
              View the branch’s published results
            </Source>
            <p className="notice">
              These results are reproduced as branch-reported information. Test
              Report Forms have not been independently authenticated for this
              website. Results vary by learner; no score is guaranteed. Student
              portraits and personal testimonials are withheld pending
              publication consent.
            </p>
            <Action href="/courses">Explore your pathway</Action>
          </section>
        </>
      );
    case "partnerships":
      return (
        <>
          <PageHero
            label="Institutional relationships"
            title="Connections with a clear record."
            intro="Understand the documented relationship between HEXA’S locations and the IELTS testing network."
          />
          <section className="wrap inner-section">
            <div className="two-col">
              <article className="prose">
                <h2>British Council IELTS</h2>
                <p>
                  The official IELTS directory identifies British Council HEXA’S
                  Education venues at Zindabazar, Majortila and Moulvibazar.
                  These listings support the named locations; they do not
                  automatically apply to every branch.
                </p>
                <p>
                  HEXA’S supplied archive also documents British Council IELTS
                  recognition, including the Highest Volume Contributor
                  Bangladesh 2026 award.
                </p>
                <Action href="/achievements" outline>
                  Explore recognition
                </Action>
                <h3>Book through the official process</h3>
                <p>
                  For examination registration, use the official branch
                  registration page and verify all test details with the
                  provider. This website does not collect test fees or promise
                  examination seats.
                </p>
                <a
                  className="text-link"
                  href={research.operationalLinks.examRegistration}
                >
                  Zindabazar exam registration ↗
                </a>
              </article>
              <aside className="info-panel">
                <h3>Official test venue listings</h3>
                {branches
                  .filter((b) => b.sources.some((s) => s.includes("ielts.org")))
                  .map((b) => (
                    <div key={b.slug} style={{ marginBottom: 25 }}>
                      <p>{b.name}</p>
                      <Source
                        href={b.sources.find((s) => s.includes("ielts.org"))!}
                      >
                        View IELTS.org listing
                      </Source>
                    </div>
                  ))}
              </aside>
            </div>
          </section>
        </>
      );
    case "facilities":
      return (
        <>
          <PageHero
            label="The learning experience"
            title="Preparation with purpose."
            intro="Explore how published branch offerings support focused English language learning and IELTS preparation."
          />
          <section className="wrap inner-section">
            <div className="two-col">
              <article className="prose">
                <h2>
                  From familiarity
                  <br />
                  <em>to confidence.</em>
                </h2>
                <p>
                  Zindabazar publishes IELTS on Computer preparation and a CD
                  HICU intensive pathway. Its course information describes
                  computer-based practice and a demanding independent study
                  routine.
                </p>
                <p>
                  English language options include spoken communication, grammar
                  and writing, and children’s English. Discuss your current
                  level and the support available with the offering branch.
                </p>
                <Source href="https://hexaszindabazar.com/">
                  Explore Zindabazar’s published facilities and programs
                </Source>
                <h3>Visit with a clear plan</h3>
                <ul>
                  <li>
                    Confirm which facilities are available at your chosen
                    branch.
                  </li>
                  <li>Ask about practice access and teacher feedback.</li>
                  <li>Discuss accessibility needs before visiting.</li>
                  <li>Confirm the classroom or test venue address.</li>
                </ul>
                <Action href="/branches">Find a branch</Action>
              </article>
              <aside className="info-panel">
                <Eyebrow>Explore the pathways</Eyebrow>
                {courses.slice(0, 5).map((c) => (
                  <p key={c.slug}>
                    <Link className="text-link" href={`/courses/${c.slug}`}>
                      {c.title} ↗
                    </Link>
                  </p>
                ))}
                <p className="notice">
                  The supplied photographs document recognition events.
                  Classroom and laboratory photography will be added when
                  identified and approved by the relevant branches.
                </p>
              </aside>
            </div>
          </section>
        </>
      );
    case "news":
      return (
        <>
          <PageHero
            label="News, events & resources"
            title="The next chapter, in focus."
            intro="Institutional recognition, learning guidance and moments from the HEXA’S journey."
          />
          <section className="wrap inner-section">
            <div className="news-grid">
              {news.map((n) => (
                <Link
                  className="news-card"
                  key={n.slug}
                  href={`/news/${n.slug}`}
                >
                  <Photo src={n.image} alt={n.title} />
                  <p className="small-label">
                    {n.date} / {n.category}
                  </p>
                  <h3>{n.title}</h3>
                  <span className="text-link">Read the story ↗</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      );
    case "gallery":
      return (
        <>
          <PageHero
            label="The HEXA’S archive"
            title="Real people. Shared milestones."
            intro="Original institutional photography from recognition ceremonies and partnership gatherings."
          />
          <section className="wrap inner-section">
            <Gallery items={gallery} />
          </section>
        </>
      );
    case "contact":
      return (
        <>
          <PageHero
            label="Contact & admissions"
            title="Let’s find your next step."
            intro="Tell us about your learning goals, or connect directly with a published branch contact."
          />
          <section className="wrap inner-section two-col contact-grid">
            <InquiryForm branches={branches} courses={courses} />
            <aside className="contact-sidebar">
              {branches.map((b) => (
                <div key={b.slug}>
                  <h3>{b.name}</h3>
                  <p>{b.address}</p>
                  {b.phone ? (
                    <a href={`tel:${b.phone}`}>{b.phone} ↗</a>
                  ) : (
                    <a href={b.website}>Official venue listing ↗</a>
                  )}
                  <p style={{ marginTop: 15 }}>
                    <Link href={`/branches/${b.slug}`}>
                      Branch details and directions →
                    </Link>
                  </p>
                </div>
              ))}
            </aside>
          </section>
        </>
      );
    case "privacy":
      return (
        <>
          <PageHero
            label="Privacy notice"
            title="Your inquiry. Handled with care."
            intro="How this website handles the information you choose to send."
          />
          <article
            className="wrap inner-section prose"
            style={{ maxWidth: 850 }}
          >
            <h2>Information you submit</h2>
            <p>
              The admissions form asks for your name, email, optional phone
              number, program and branch preferences, and a message. The team
              uses this information to respond to your inquiry with your
              consent.
            </p>
            <h2>Delivery and spam protection</h2>
            <p>
              When online inquiries are enabled, submissions are sent to the
              institution’s configured admissions inbox using Resend. Cloudflare
              Turnstile processes a security token to help prevent automated
              abuse. The website does not store inquiries in its own database.
            </p>
            <h2>Your choices</h2>
            <p>
              Only submit information needed for your question. Do not send
              identity documents, payment details or sensitive records through
              this form. You can contact a branch directly to request correction
              or deletion of an inquiry.
            </p>
            <h2>Cookies and third-party links</h2>
            <p>
              This build does not enable advertising or analytics cookies by
              default. Security services may process technical information when
              the form is used. External branch websites, IELTS listings and map
              services have their own privacy practices.
            </p>
            <p className="notice">
              Before public launch, HEXA’S must confirm the responsible
              organization, designated privacy contact, inbox access and
              retention policy. This notice describes the supplied
              implementation.
            </p>
            <Action href="/contact" outline>
              Branch contacts
            </Action>
          </article>
        </>
      );
    case "bn":
      return (
        <div lang="bn" className="bn-content">
          <PageHero
            label="HEXA’S EDUCATION BANGLADESH"
            title="শেখার মাধ্যমে সম্ভাবনার নতুন দুয়ার।"
            intro="ইংরেজি ভাষা শিক্ষা ও আইইএলটিএস প্রস্তুতির জন্য আপনার লক্ষ্য অনুযায়ী পথ খুঁজে নিন।"
          />
          <section className="wrap inner-section prose">
            <h2>আপনার পরবর্তী পদক্ষেপ</h2>
            <p>
              কোর্স, বর্তমান সময়সূচি ও ভর্তি সম্পর্কে জানতে সংশ্লিষ্ট শাখার
              সঙ্গে যোগাযোগ করুন। এই ওয়েবসাইটে প্রকাশিত শাখার তথ্য ও অর্জনগুলো
              উৎসের ভিত্তিতে উপস্থাপন করা হয়েছে।
            </p>
            <div className="branch-cards">
              {branches.map((b) => (
                <div className="branch-card" key={b.slug}>
                  <h3 lang="en">{b.name}</h3>
                  <p lang="en">{b.address}</p>
                  {b.phone && (
                    <a href={`tel:${b.phone}`} lang="en">
                      {b.phone}
                    </a>
                  )}
                  <p>
                    <Link href={`/branches/${b.slug}`}>
                      শাখার বিস্তারিত তথ্য ↗
                    </Link>
                  </p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 35 }}>
              বিস্তারিত কোর্স ও গবেষণার তথ্য বর্তমানে ইংরেজিতে পাওয়া যাচ্ছে।
              পূর্ণাঙ্গ বাংলা অনুবাদ প্রকাশের আগে ভাষাগত পর্যালোচনা করা হবে।
            </p>
            <Action href="/courses">Explore programs</Action>
          </section>
        </div>
      );
    default:
      notFound();
  }
}
