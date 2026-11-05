"use client";
import { useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import type { FormEvent } from "react";
import { branches as defaultBranches, courses as defaultCourses, type Branch, type Course } from "@/lib/content";
type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
export function InquiryForm({branches=defaultBranches,courses=defaultCourses}:{branches?:Branch[];courses?:Course[]}) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = useRef("");
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  function renderChallenge() {
    if (widget.current && window.turnstile && !widgetId.current)
      widgetId.current = window.turnstile.render(widget.current, {
        sitekey: key,
        theme: "dark",
        callback: (value: string) => {
          token.current = value;
        },
        "expired-callback": () => {
          token.current = "";
        },
        "error-callback": () => {
          token.current = "";
          setStatus(
            "Security check could not load. Please retry or call a branch.",
          );
        },
      });
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus("");
    setSuccess(false);
    const form = e.currentTarget;
    const values = new FormData(form);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(values),
          consent: values.get("consent") === "on",
          turnstileToken: token.current,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Please try again.");
      } else {
        setStatus(result.message);
        setSuccess(true);
        form.reset();
      }
    } catch {
      setStatus("We could not connect. Please try again or call your branch.");
    } finally {
      setPending(false);
      token.current = "";
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }
  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Full name"
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone <small>(optional)</small>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="+880"
          />
        </label>
        <label>
          Preferred branch
          <select name="branch">
            <option value="">Help me choose</option>
            {branches.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Interested in
        <select name="program">
          <option value="">I’d like some guidance</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        How can we help?
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={4}
          placeholder="Tell us about your learning goals…"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree to be contacted about my inquiry. Read our{" "}
          <Link href="/privacy">privacy notice</Link>.
        </span>
      </label>
      {key ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            onReady={renderChallenge}
          />
          <div ref={widget} />
        </>
      ) : (
        <p className="form-note">
          For immediate assistance, call your chosen branch. Online delivery
          requires the admissions service to be connected.
        </p>
      )}
      <button className="action" disabled={pending} type="submit">
        {pending ? "Sending…" : "Send inquiry"}
        <span className="action-arrow">↗</span>
      </button>
      <p
        role="status"
        className={success ? "form-status success" : "form-status"}
      >
        {status}
      </p>
    </form>
  );
}
