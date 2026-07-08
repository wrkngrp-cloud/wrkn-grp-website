import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";
import Preloader from "../components/Preloader";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  metadataBase: new URL("https://wrkngrp.com"),
  title: {
    default: "WRKN GRP — Led by Strategy. Built in Culture.",
    template: "%s — WRKN GRP",
  },
  description:
    "The strategic creative partner for challenger brands building in Africa. We help founders and CMOs move from having a product to having a point of view.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Larken is a licensed family — it leads the CSS stack and will be
            picked up the moment its files are self-hosted. Sentient (display)
            and General Sans (body) are the live Fontshare fallbacks. */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=sentient@300,301,400,401,500,501,700,701&f[]=general-sans@400,401,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
