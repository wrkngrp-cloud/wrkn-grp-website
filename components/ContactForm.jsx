"use client";

import { useState } from "react";

/*
 * Kept deliberately short per the content doc: name, why you're here,
 * the message, a link. Static export has no backend, so submit opens a
 * pre-filled email to the studio inbox. Full states: inline validation
 * (below field, ux-writing patterns), a sending beat, and an honest
 * confirmation (mailto can't confirm delivery, so we don't pretend to).
 */
const EMAIL = "beatsbynuel@gmail.com";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", door: "Brands", message: "", link: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Add your name so we know who's reaching out.";
    if (!form.message.trim()) next.message = "Tell us what you're reaching out about.";
    return next;
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      // move focus to the first field with an error
      const first = found.name ? "cf-name" : "cf-message";
      document.getElementById(first)?.focus();
      return;
    }
    setStatus("sending");
    const subject = encodeURIComponent(`${form.door} · ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n${form.link ? `Link: ${form.link}\n` : ""}· ${form.name}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    // mailto hands off to the mail client; reflect that honestly
    window.setTimeout(() => setStatus("sent"), 400);
  };

  if (status === "sent") {
    return (
      <div className="card" role="status" aria-live="polite" style={{ display: "grid", gap: "0.8rem" }}>
        <h3 className="display-4">Your email is on its way.</h3>
        <p className="dim measure">
          We just opened a draft in your mail app, ready to send. If nothing
          popped up, write to us at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we&rsquo;ll take it from
          there.
        </p>
        <button
          type="button"
          className="text-link"
          style={{ justifySelf: "start" }}
          onClick={() => {
            setForm({ name: "", door: "Brands", message: "", link: "" });
            setStatus("idle");
          }}
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={submit} noValidate style={{ display: "grid", gap: "1.6rem" }}>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input
          id="cf-name"
          value={form.name}
          onChange={set("name")}
          onBlur={() => !form.name.trim() && setErrors((p) => ({ ...p, name: "Add your name so we know who's reaching out." }))}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "cf-name-err" : undefined}
        />
        {errors.name && (
          <p id="cf-name-err" className="field-error" role="alert">{errors.name}</p>
        )}
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
          value={form.message}
          onChange={set("message")}
          onBlur={() => !form.message.trim() && setErrors((p) => ({ ...p, message: "Tell us what you're reaching out about." }))}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
        />
        {errors.message && (
          <p id="cf-message-err" className="field-error" role="alert">{errors.message}</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="cf-link">A link (music, brand, anything)</label>
        <input
          id="cf-link"
          type="url"
          placeholder="https://"
          value={form.link}
          onChange={set("link")}
          autoComplete="url"
        />
      </div>

      <button type="submit" className="btn" data-cursor="Send" disabled={status === "sending"}>
        {status === "sending" ? "Opening your email…" : "Send it"}
      </button>
    </form>
  );
}
