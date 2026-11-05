import { Action } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow" style={{ justifyContent: "center" }}>
        404 / A different path
      </p>
      <h1>
        Let’s get you
        <br />
        <em>back on track.</em>
      </h1>
      <p>This page could not be found.</p>
      <Action href="/">Back to HEXA’S</Action>
    </section>
  );
}
