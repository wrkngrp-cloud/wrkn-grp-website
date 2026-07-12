import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";

export const metadata = {
  title: "Sweetness Studios — Music with soul at its core",
  description:
    "Sweetness Studios is the sound arm of WRKN GRP. Records for artists. A voice for brands. The room that arranges the night you won't forget.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Balkist (display) and Heuvel Grotesk (body) are licensed, not yet
            self-hosted. Zodiak (display serif) and General Sans (body) are
            the live Fontshare fallbacks; stacks are set in globals.css. */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=zodiak@400,401,500,501,700,701&f[]=general-sans@400,401,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/brand/mark.svg" type="image/svg+xml" />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
