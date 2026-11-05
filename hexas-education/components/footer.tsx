import Link from "next/link";
import { Action } from "./ui";
export function Footer() {
  return (
    <>
      <section className="closing wrap">
        <p className="eyebrow">
          <span />
          Your next chapter starts here
        </p>
        <div>
          <h2>
            Big ambitions.
            <br />
            <em>Begin with a conversation.</em>
          </h2>
          <Action href="/contact">Find your way forward</Action>
        </div>
      </section>
      <footer className="footer wrap">
        <div className="footer-top">
          <Link href="/" className="brand">
            <span>
              HEXA’S<span className="brand-dot">.</span>
            </span>
            <small>EDUCATION BANGLADESH</small>
          </Link>
          <p>
            Learning that opens doors.
            <br />
            An educational journey since 2007.
          </p>
          <div>
            <h3>Explore</h3>
            {[
              ["About HEXA’S", "about"],
              ["Our branches", "branches"],
              ["Achievements", "achievements"],
              ["Partnerships", "partnerships"],
              ["Learning experience", "facilities"],
            ].map(([t, s]) => (
              <Link key={s} href={`/${s}`}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h3>Your next step</h3>
            {[
              ["Programs", "courses"],
              ["Student stories", "success"],
              ["News & updates", "news"],
              ["Gallery & media", "gallery"],
              ["Contact & admissions", "contact"],
            ].map(([t, s]) => (
              <Link key={s} href={`/${s}`}>
                {t}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HEXA’S Education Bangladesh</span>
          <Link href="/privacy">Privacy notice</Link>
          <a href="https://appsznd.hexaszindabazar.com/student/login">
            Zindabazar student portal ↗
          </a>
          <Link href="/bn" lang="bn">
            বাংলা
          </Link>
        </div>
      </footer>
    </>
  );
}
