"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { courses as defaults, type Course } from "@/lib/content";
const links = [
  ["About HEXA’S", "/about"],
  ["Recognition", "/achievements"],
  ["Our branches", "/branches"],
];
export function Navigation({courses=defaults}:{courses?:Course[]}) {
  const [open, setOpen] = useState(false);
  const [programs, setPrograms] = useState(false);
  const path = usePathname();
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
        setPrograms(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const close = () => {
    setOpen(false);
    setPrograms(false);
  };
  return (
    <header
      ref={root}
      className="nav-shell"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <Link
        href="/"
        className="brand"
        aria-label="HEXA’S Education home"
        onClick={close}
      >
        <span>
          HEXA<span className="brand-apostrophe">’</span>S
          <span className="brand-dot">.</span>
        </span>
        <small>EDUCATION BANGLADESH</small>
      </Link>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={open ? "nav-links is-open" : "nav-links"}
      >
        <div className="program-nav">
          <button
            aria-expanded={programs}
            aria-controls="program-menu"
            onClick={() => setPrograms(!programs)}
          >
            Programs <span aria-hidden="true">⌄</span>
          </button>
          {programs && (
            <div className="mega-menu" id="program-menu">
              <div>
                <span className="eyebrow">Your next chapter</span>
                <h2>
                  Find your
                  <br />
                  <em>way forward.</em>
                </h2>
                <Link href="/courses" onClick={close}>
                  All programs ↗
                </Link>
              </div>
              <div>
                {courses.slice(0, 7).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    onClick={close}
                  >
                    {c.title}
                    <span>↗</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {links.map(([title, href]) => (
          <Link
            key={href}
            aria-current={path === href ? "page" : undefined}
            href={href}
            onClick={close}
          >
            {title}
          </Link>
        ))}
        <Link className="language" href="/bn" lang="bn" onClick={close}>
          বাংলা
        </Link>
        <Link className="nav-cta" href="/contact" onClick={close}>
          Let’s talk <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}
