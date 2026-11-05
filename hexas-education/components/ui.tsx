import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}
export function Action({
  href,
  children,
  outline = false,
}: {
  href: string;
  children: ReactNode;
  outline?: boolean;
}) {
  return (
    <Link className={`action ${outline ? "outline" : ""}`} href={href}>
      {children}
      <span className="action-arrow">
        <Arrow />
      </span>
    </Link>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 65vw, 900px"
        priority={priority}
      />
    </div>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function SectionHead({
  label,
  title,
  italic,
  href,
  link = "Explore more",
}: {
  label: string;
  title: string;
  italic?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2>
          {title} {italic && <em>{italic}</em>}
        </h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link} <Arrow diagonal />
        </Link>
      )}
    </div>
  );
}
export function PageHero({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="page-hero wrap">
      <Eyebrow>{label}</Eyebrow>
      <h1>{title}</h1>
      <p>{intro}</p>
    </section>
  );
}
export function Source({
  href,
  children = "View original source",
}: {
  href: string;
  children?: ReactNode;
}) {
  return href ? (
    <a className="source" href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  ) : null;
}
