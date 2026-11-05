"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import {
  courses as fallbackCourses,
  awards as fallbackAwards,
  gallery as fallbackGallery,
  branches as fallbackBranches,
  type Course,
  type Branch,
} from "@/lib/content";
import { Action, Photo, Source } from "./ui";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { y: [18, 0], opacity: [0.7, 1] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function AwardShowcase({
  items = fallbackAwards,
}: {
  items?: typeof fallbackAwards;
}) {
  const [index, setIndex] = useState(0);
  const award = items[index] || items[0];
  if(!award) return <p>Recognition records will be published here when available.</p>;
  return (
    <div className="award-showcase">
      <div className="award-visual">
        <Photo
          src={award.image}
          alt={award.alt}
          className={index === 0 ? "contain" : ""}
        />
        <span className="image-note">HEXA’S ARCHIVE / {award.year}</span>
      </div>
      <div className="award-copy">
        <p className="small-label">{award.issuer}</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={award.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="award-year">{award.year}</p>
            <h3>{award.title}</h3>
            <p className="award-subtitle">{award.subtitle}</p>
            <p className="muted">{award.scope}</p>
            <Link className="text-link" href={`/achievements/${award.slug}`}>
              The story behind the recognition ↗
            </Link>
          </motion.div>
        </AnimatePresence>
        <div className="slide-controls">
          <span>
            0{index + 1}
            <span className="muted"> / 0{items.length}</span>
          </span>
          <div>
            <button
              aria-label="Previous achievement"
              onClick={() =>
                setIndex((index - 1 + items.length) % items.length)
              }
            >
              ←
            </button>
            <button
              aria-label="Next achievement"
              onClick={() => setIndex((index + 1) % items.length)}
            >
              →
            </button>
          </div>
        </div>
        <div className="slide-tracks">
          {items.map((a, i) => (
            <button
              key={a.slug}
              aria-label={`Show ${a.title}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export function ProgramExplorer({
  items = fallbackCourses,
}: {
  items?: Course[];
}) {
  const categories = [
    "IELTS preparation",
    "English language",
    "Digital skills",
  ];
  const [active, setActive] = useState(categories[0]);
  return (
    <div className="program-explorer">
      <div
        className="program-tabs"
        role="tablist"
        aria-label="Program categories"
      >
        {categories.map((c, i) => (
          <button
            role="tab"
            id={`tab-${i}`}
            aria-controls="program-panel"
            aria-selected={active === c}
            tabIndex={active === c ? 0 : -1}
            key={c}
            onClick={() => setActive(c)}
            onKeyDown={(e) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const n =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                setActive(categories[n]);
                document.getElementById(`tab-${n}`)?.focus();
              }
            }}
          >
            <span>0{i + 1}</span>
            {c}
            <span>↗</span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="program-panel"
        aria-labelledby={`tab-${categories.indexOf(active)}`}
        className="program-panel"
      >
        <div className="program-intro">
          <span className="outline-number">
            0{categories.indexOf(active) + 1}
          </span>
          <h3>
            {active === "IELTS preparation" ? (
              <>
                Your ambition.
                <br />
                <em>A world of possibilities.</em>
              </>
            ) : active === "English language" ? (
              <>
                Find your words.
                <br />
                <em>Build your confidence.</em>
              </>
            ) : (
              <>
                Learn the tools.
                <br />
                <em>Create your future.</em>
              </>
            )}
          </h3>
          <p>
            Explore a pathway that fits your goals. Our branch teams can help
            you choose your next step.
          </p>
          <Action href="/courses" outline>
            Explore programs
          </Action>
        </div>
        <div className="course-accordion" key={active}>
          {items
            .filter((c) => c.category === active)
            .map((c, i) => (
              <details key={c.slug} name="courses" open={i === 0}>
                <summary>
                  <span>{c.title}</span>
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div>
                  <p>{c.intro}</p>
                  <Link href={`/courses/${c.slug}`}>
                    Discover the program ↗
                  </Link>
                </div>
              </details>
            ))}
        </div>
      </div>
    </div>
  );
}
export function BranchExplorer({
  items = fallbackBranches,
}: {
  items?: Branch[];
}) {
  const [active, setActive] = useState(items[0]?.slug || "");
  const branch = items.find((b) => b.slug === active) || items[0];
  if(!branch) return <p>Branch details will be published here when available.</p>;
  return (
    <div className="branch-explorer">
      <div className="branch-art" aria-hidden="true">
        <div className="map-orbit orbit-one" />
        <div className="map-orbit orbit-two" />
        <div className="map-orbit orbit-three" />
        <span className="map-label">BANGLADESH</span>
        <span className="map-pin">
          ✦<small>Sylhet</small>
        </span>
        <span className="map-pin second">
          ✦<small>Moulvibazar</small>
        </span>
        <span className="map-foot">Connected by learning.</span>
      </div>
      <div className="branch-list">
        <p className="small-label">Explore our published locations</p>
        {items.map((b) => (
          <button
            key={b.slug}
            aria-expanded={b.slug === active}
            aria-controls="branch-detail"
            onClick={() => setActive(b.slug)}
            className={b.slug === active ? "active" : ""}
          >
            <span>
              {b.name}
              <small>{b.city}</small>
            </span>
            <span>↗</span>
          </button>
        ))}
        <div id="branch-detail" className="branch-detail" aria-live="polite">
          <p>{branch.address}</p>
          <Link className="text-link" href={`/branches/${branch.slug}`}>
            Branch information →
          </Link>
        </div>
      </div>
    </div>
  );
}
export function Journey() {
  const points = [
    {
      year: "2007",
      title: "An educational journey begins.",
      text: "HEXA’S traces its beginnings in Bangladesh to 2007, as documented in its institutional history.",
    },
    {
      year: "2020",
      title: "A related chapter in the USA.",
      text: "HEXA’S LLC was established in Michigan in 2020. Its community services are distinct from the Bangladesh education network.",
    },
    {
      year: "2026",
      title: "Recognition beyond borders.",
      text: "Supplied British Council IELTS award photographs document Highest Volume Contributor Bangladesh and Highest Growth South Asia recognition.",
    },
  ];
  const [index, setIndex] = useState(0);
  return (
    <div className="journey">
      <div className="journey-years">
        {points.map((p, i) => (
          <button
            key={p.year}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {p.year}
            <span />
          </button>
        ))}
      </div>
      <div className="journey-story" aria-live="polite">
        <span className="huge-year">{points[index].year}</span>
        <div>
          <h3>{points[index].title}</h3>
          <p>{points[index].text}</p>
          <Source href="https://www.hexasusa.com/discover-hexas">
            Read the institutional history
          </Source>
        </div>
      </div>
    </div>
  );
}
export function Gallery({
  items = fallbackGallery,
}: {
  items?: typeof fallbackGallery;
}) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  if(!items.length) return <p>Media will be published here when available.</p>;
  return (
    <>
      <div className="filter-bar" aria-label="Gallery categories">
        {["All", ...new Set(items.map(item=>item.category))].map((f) => (
          <button
            key={f}
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {items
          .filter((g) => filter === "All" || g.category === filter)
          .map((g) => (
            <button
              key={g.image}
              onClick={() => {
                setSelected(items.indexOf(g));
                dialog.current?.showModal();
              }}
            >
              <Photo src={g.image} alt={g.title} />
              <span>{g.title} ↗</span>
            </button>
          ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close photograph"
          onClick={() => dialog.current?.close()}
        >
          Close ×
        </button>
        <Photo
          src={items[selected].image}
          alt={items[selected].title}
          className="contain"
        />
        <p>{items[selected].title}</p>
      </dialog>
    </>
  );
}
export function CourseDirectory({
  items = fallbackCourses,
}: {
  items?: Course[];
}) {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <div className="filter-bar">
        {["All", "IELTS preparation", "English language", "Digital skills"].map(
          (c) => (
            <button
              key={c}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ),
        )}
      </div>
      <div className="course-directory">
        {items
          .filter((c) => filter === "All" || c.category === filter)
          .map((c, i) => (
            <Link href={`/courses/${c.slug}`} key={c.slug}>
              <span className="small-label">
                0{i + 1} / {c.category}
              </span>
              <h2>{c.title}</h2>
              <p>{c.intro}</p>
              <span className="round-arrow">↗</span>
            </Link>
          ))}
      </div>
    </>
  );
}
