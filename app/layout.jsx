import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource/schibsted-grotesk/latin-400.css";
import "@fontsource/schibsted-grotesk/latin-500.css";
import "@fontsource/schibsted-grotesk/latin-700.css";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "Sweetness Studios · Music with soul at its core",
  description:
    "Music with soul at its core, built to become the soundtrack of people's lives. Records for artists, a voice for brands, direction for the nights nobody forgets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Type is self-hosted: Fraunces Variable (display voice) and
            Schibsted Grotesk (body and UI), bundled via fontsource so
            the base path is handled by the asset pipeline. */}
        <link rel="icon" href={`${basePath}/brand/mark.svg`} type="image/svg+xml" />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <Nav />
        {children}
        <Footer />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
