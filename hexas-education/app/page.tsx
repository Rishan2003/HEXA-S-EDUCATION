import Link from "next/link";
import Image from "next/image";
import { Action, Eyebrow, Photo, SectionHead } from "@/components/ui";
import {
  AwardShowcase,
  ProgramExplorer,
  BranchExplorer,
  Journey,
  Reveal,
} from "@/components/interactive";
import { getSiteContent } from "@/lib/site-content";
import { siteUrl } from "@/lib/content";
export const revalidate = 300;
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const { awards, courses, branches, news, studentStories } = await getSiteContent();
  const featured=studentStories[0];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "HEXA’S Education Bangladesh",
            url: siteUrl,
            foundingDate: "2007",
            description:
              "English language education and IELTS preparation in Bangladesh.",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero">
        <Image
          className="hero-image"
          src="/media/british-council-award-ceremony.webp"
          alt="HEXA’S Education representatives receiving recognition at a British Council IELTS ceremony"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-content wrap">
          <Eyebrow>HEXA’S EDUCATION · BANGLADESH</Eyebrow>
          <h1>
            Learning that
            <br />
            <em>opens doors.</em>
          </h1>
          <div className="hero-bottom">
            <p>
              From your first words in English
              <br />
              to your next chapter in the world.
            </p>
            <Action href="/courses">Explore our programs</Action>
            <Link className="hero-scroll" href="#recognition">
              Discover HEXA’S <span>↓</span>
            </Link>
          </div>
        </div>
        <div className="hero-caption">
          BRITISH COUNCIL IELTS RECOGNITION / HEXA’S ARCHIVE
        </div>
      </section>
      <div className="legacy-strip wrap">
        <span>
          <strong>Since 2007</strong>
          <small>A journey in education</small>
        </span>
        <span>
          <strong>Rooted in Sylhet</strong>
          <small>Connected by ambition</small>
        </span>
        <span>
          <strong>Recognised in 2026</strong>
          <small>Bangladesh & South Asia</small>
        </span>
        <Link href="/about">
          Our story <span>↗</span>
        </Link>
      </div>
      <section id="recognition" className="section wrap">
        <Reveal>
          <div className="intro-grid">
            <Eyebrow>A commitment recognised</Eyebrow>
            <h2>
              Progress, made together.
              <br />
              <em>Recognition, earned.</em>
            </h2>
            <p>
              Behind every recognition is a shared commitment to learning.
              Discover the milestones and people shaping the HEXA’S journey.
            </p>
          </div>
          <AwardShowcase items={awards} />
        </Reveal>
      </section>
      <section id="programs" className="section programs-section">
        <div className="wrap">
          <Reveal>
            <SectionHead
              label="Your ambition. Your pathway."
              title="A world of possibilities."
              italic="Start here."
              href="/courses"
              link="All programs"
            />
            <ProgramExplorer items={courses} />
          </Reveal>
        </div>
      </section>
      <section className="section wrap">
        <Reveal>
          <div className="experience-grid">
            <div>
              <Eyebrow>More than preparation</Eyebrow>
              <h2>
                Build your skills.
                <br />
                <em>Find your confidence.</em>
              </h2>
              <p className="lead">
                A test is a moment. The ability to communicate stays with you.
              </p>
              <p>
                Discover English language learning and IELTS preparation
                pathways, with branch teams to help you make an informed next
                step.
              </p>
              <Action href="/facilities" outline>
                Explore the learning experience
              </Action>
            </div>
            <div className="experience-image">
              <Photo
                src="/media/institutional-recognition.webp"
                alt="HEXA’S representatives at a British Council institutional recognition ceremony"
              />
              <span className="vertical-caption">
                A SHARED COMMITMENT TO EDUCATION
              </span>
            </div>
          </div>
          <div className="learning-highlights">
            {[
              [
                "01",
                "Purposeful preparation",
                "Choose a pathway around your language goals.",
              ],
              [
                "02",
                "Practice with direction",
                "Explore course formats and learning support.",
              ],
              [
                "03",
                "A branch team to guide you",
                "Discuss your next step with your local team.",
              ],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="recognition-band">
        <div className="wrap">
          <Eyebrow>Recognised relationships</Eyebrow>
          <h2>
            Real connections.
            <br />
            <em>Documented recognition.</em>
          </h2>
          <div className="partner-line">
            <span>
              British Council <b>IELTS</b>
            </span>
            <p>
              Official IELTS listings identify HEXA’S test venues in Zindabazar,
              Majortila and Moulvibazar.
            </p>
            <Link className="text-link" href="/partnerships">
              Explore the relationships ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <Reveal>
          <SectionHead
            label="Learning, closer to you"
            title="Local roots."
            italic="Wider horizons."
            href="/branches"
            link="Explore locations"
          />
          <BranchExplorer items={branches} />
        </Reveal>
      </section>
      <section className="section journey-section">
        <div className="wrap">
          <Reveal>
            <SectionHead
              label="The HEXA’S journey"
              title="One belief."
              italic="New chapters."
              href="/about"
              link="Our story"
            />
            <Journey />
          </Reveal>
        </div>
      </section>
      <section className="section wrap">
        <Reveal>
          <SectionHead
            label="The people behind the progress"
            title="Every learner has"
            italic="a next chapter."
            href="/success"
            link="Student stories"
          />
          {featured ? <div className="success-feature">
            <div className="band-number">
              {featured.band?.toFixed(1) || "→"}<span>{featured.band!==null?"OVERALL IELTS BAND":"STUDENT JOURNEY"}</span>
            </div>
            <div>
              <p className="small-label">{featured.branch} · PUBLISHED STUDENT RECORD</p>
              <h3>{featured.name}</h3>
              <p>
                {featured.summary}
              </p>
              <Link className="text-link" href="/success">
                Explore student results ↗
              </Link>
            </div>
          </div> : <p>Student stories will appear here after publication approval.</p>}
        </Reveal>
      </section>
      <section className="section news-section">
        <div className="wrap">
          <Reveal>
            <SectionHead
              label="In the spotlight"
              title="Moments that"
              italic="move us forward."
              href="/news"
              link="All updates"
            />
            <div className="news-grid">
              {news.slice(0, 3).map((n) => (
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
          </Reveal>
        </div>
      </section>
    </>
  );
}
