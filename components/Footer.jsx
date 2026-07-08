import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="theme-dark"
      style={{
        borderTop: "1px solid rgba(244,239,230,0.1)",
        padding: "2.2rem var(--gutter)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <Link href="/" aria-label="WRKN GRP — Home" style={{ color: "var(--cream)" }}>
        <Logo width={110} />
      </Link>
      <p className="small-caps" style={{ opacity: 0.55, margin: 0 }}>
        © {year} WRKN GRP, All rights reserved
      </p>
      <a
        href="https://instagram.com/wrkngrp"
        target="_blank"
        rel="noopener noreferrer"
        className="link-draw small-caps"
      >
        Instagram
      </a>
    </footer>
  );
}
