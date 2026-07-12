import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";
import SceneMount from "../components/SceneMount";

export const metadata = {
  title: "Sweetness Studios · Music with soul at its core",
  description:
    "Music with soul at its core, built to become the soundtrack of people's lives. Records for artists, a voice for brands, direction for the nights nobody forgets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Heuvel Grotesk (licensed, not yet self-hosted) is the single
            house face. General Sans is the live Fontshare fallback; the
            stack is set in globals.css. */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,401,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/brand/mark.svg" type="image/svg+xml" />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <SceneMount />
        <Nav />
        {children}
        <Footer />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
