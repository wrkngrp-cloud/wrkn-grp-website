import { LOGO_PATH } from "./logoPath";

/*
 * Official WRKN GRP wordmark: serif-italic "wrkn" (the agility, the lean
 * away from convention) anchored by bold sans "grp." (the grounding, the
 * period as a declaration). Single color via currentColor so it sits on
 * warm black or cream without separate assets.
 *
 * The viewBox is cropped to the wordmark's bounds inside the source file.
 */
export default function Logo({ width = 130, label = "WRKN GRP", style }) {
  return (
    <svg
      viewBox="370 278 460 133"
      width={width}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", height: "auto", ...style }}
    >
      <path d={LOGO_PATH} fill="currentColor" />
    </svg>
  );
}
