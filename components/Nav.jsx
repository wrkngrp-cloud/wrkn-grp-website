"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studio/", label: "Studio" },
  { href: "/what-we-do/", label: "What We Do" },
  { href: "/work/", label: "Work" },
  { href: "/releases/", label: "Releases" },
  { href: "/contact/", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-brand" aria-label="Sweetness Studios home">
            <Logo size={30} />
            <span>Sweetness Studios</span>
          </Link>

          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} data-active={isActive(l.href)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open && (
        <div className="nav-sheet">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-active={isActive(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
