"use client";

import { useState } from "react";
import Magnetic from "./Magnetic";

/*
 * No backend yet: the form composes a structured email and hands it to
 * the visitor's mail client via mailto.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "Brand Strategy", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${form.type} — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.type}\n\n${form.message}`
    );
    window.location.href = `mailto:emmanuel@wrkngrp.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "2.2rem", maxWidth: "36rem" }}>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" required value={form.name} onChange={set("name")} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="cf-type">Project Type</label>
        <select id="cf-type" value={form.type} onChange={set("type")}>
          <option>Brand Strategy</option>
          <option>Positioning Workshop</option>
          <option>Creative Execution</option>
          <option>Campaign Strategy</option>
          <option>Fractional CMO</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" rows={5} required value={form.message} onChange={set("message")} placeholder="Tell us what you're building." />
      </div>
      <Magnetic>
        <button type="submit" className="btn btn--gold">
          Send It
        </button>
      </Magnetic>
    </form>
  );
}
