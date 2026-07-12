/*
 * The lollipop mark, redrawn as SVG from the logo file's exact hexes.
 * Swirl head over melting drips over the ice-blue stick — the one place
 * the full saturated logo hues appear untouched by the site's grading.
 */
export default function Logo({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="lp-head" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#FCA818" />
          <stop offset="45%" stopColor="#FC7818" />
          <stop offset="100%" stopColor="#FC2418" />
        </radialGradient>
        <linearGradient id="lp-stick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0D8E4" />
          <stop offset="100%" stopColor="#8FB4C6" />
        </linearGradient>
      </defs>

      {/* stick */}
      <rect x="47" y="52" width="6" height="46" rx="3" fill="url(#lp-stick)" />

      {/* drips */}
      <rect x="26" y="42" width="7" height="26" rx="3.5" fill="#FC5484" />
      <rect x="37" y="46" width="7" height="36" rx="3.5" fill="#FC7818" />
      <rect x="56" y="46" width="7" height="32" rx="3.5" fill="#FCA818" />
      <rect x="67" y="42" width="7" height="22" rx="3.5" fill="#FC2418" />

      {/* head */}
      <circle cx="50" cy="32" r="27" fill="url(#lp-head)" />

      {/* swirl */}
      <path
        d="M50 32c0-4 4-7 8-6 6 1 9 7 7 13-2 8-11 12-19 10-10-3-15-13-12-23 3-11 15-17 26-13"
        stroke="#FC5484"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M50 32c0-2.5 2.5-4.5 5-4 3.5 0.7 5.5 4.5 4.5 8"
        stroke="#FCA818"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
