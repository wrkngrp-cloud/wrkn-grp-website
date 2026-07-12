import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-brand" style={{ marginBottom: "1.2rem" }}>
              <Logo size={34} />
              <span>Sweetness Studios</span>
            </div>
            <p className="dim measure" style={{ fontSize: "0.95rem" }}>
              The sound arm of WRKN GRP — building the songs that end up on
              the soundtrack of somebody&rsquo;s life. Records for artists. A
              voice for brands. The room nobody forgets.
            </p>
          </div>

          <div>
            <h4>Pages</h4>
            <ul>
              <li><Link href="/studio/">Studio</Link></li>
              <li><Link href="/what-we-do/">What We Do</Link></li>
              <li><Link href="/work/">Work</Link></li>
              <li><Link href="/releases/">Releases</Link></li>
              <li><Link href="/contact/">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Reach us</h4>
            <ul>
              <li>
                <a href="mailto:beatsbynuel@gmail.com">beatsbynuel@gmail.com</a>
              </li>
              <li>
                <a
                  href="https://instagram.com/nuelbeatz"
                  target="_blank"
                  rel="noreferrer"
                >
                  IG: @nuelbeatz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sweetness Studios · WRKN GRP</span>
          <span>Music with soul at its core.</span>
        </div>
      </div>
    </footer>
  );
}
