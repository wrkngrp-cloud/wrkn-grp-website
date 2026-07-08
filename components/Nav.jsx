"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "./Magnetic";
import Logo from "./Logo";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-110%" : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem var(--gutter)",
          background: "rgba(10,10,10,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(244,239,230,0.08)",
          color: "var(--cream)",
        }}
      >
        <Link href="/" aria-label="WRKN GRP — Home" style={{ color: "var(--cream)" }}>
          <Logo width={118} />
        </Link>

        <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Magnetic>
            <Link href="/contact" className="btn" style={{ padding: "0.75rem 1.5rem" }}>
              Start a Conversation
            </Link>
          </Magnetic>
        </nav>

        <button
          className="nav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ display: "none", flexDirection: "column", gap: 6, padding: 8 }}
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} style={burgerLine} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }} style={burgerLine} />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 900,
              background: "var(--black)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 var(--gutter)",
              gap: "1.4rem",
            }}
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={l.href} className="display display-md" style={{ display: "block" }}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{ marginTop: "1.5rem" }}
            >
              <Link href="/contact" className="btn btn--gold">
                Start a Conversation
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 800px) {
          :global(.nav-desktop) {
            display: none !important;
          }
          :global(.nav-burger) {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

const burgerLine = {
  display: "block",
  width: 26,
  height: 1.5,
  background: "var(--cream)",
};
