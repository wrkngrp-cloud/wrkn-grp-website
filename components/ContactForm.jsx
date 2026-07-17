"use client";

import { useState } from "react";

/*
 * Kept deliberately short per the content doc: name, why you're here,
 * the message, a link. Static export has no backend, so submit opens a
 * pre-filled email to the studio inbox — swap for a form endpoint later.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    door: "Brands",
    message: "",
    link: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${form.door} · ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n${form.link ? `Link: ${form.link}\n` : ""}· ${form.name}`
    );
    window.location.href = `mailto:beatsbynuel@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <form className="card" onSubmit={submit} style={{ display: "grid", gap: "1.6rem" }}>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input
          id="cf-name"
          required
          value={form.name}
          onChange={set("name")}
          autoComplete="name"
        />
      </div>

      <div className="field">
        <label htmlFor="cf-door">Why you&rsquo;re here</label>
        <select id="cf-door" value={form.door} onChange={set("door")}>
          <option>Brands</option>
          <option>Artists</option>
          <option>Everything else</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="cf-message">The message</label>
        <textarea
          id="cf-message"
          required
          value={form.message}
          onChange={set("message")}
        />
      </div>

      <div className="field">
        <label htmlFor="cf-link">A link (music, brand, anything)</label>
        <input
          id="cf-link"
          type="url"
          placeholder="https://"
          value={form.link}
          onChange={set("link")}
        />
      </div>

      <button type="submit" className="btn" data-cursor="Send">
        Send it
      </button>
    </form>
  );
}
