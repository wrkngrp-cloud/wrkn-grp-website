"use client";

import { useRef, useState } from "react";

/*
 * Inline audio affordance. Three states:
 * - `src`: plays the file inline with a slim scrubber.
 * - `spotify`: no file yet, so the row is a link that opens the track on
 *   Spotify. `compact` drops the title/sub when the surrounding card
 *   already names the track (Home selected work).
 * - neither: a quiet "Audio coming" line.
 *
 * Deliberately borderless: it sits inside a card, so it must not become a
 * second card. A hairline separates it from the copy above; the play
 * control is a flat ring, not a gradient orb.
 */
function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const Triangle = () => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M4 2l10 6-10 6z" />
  </svg>
);

export default function AudioPlayer({ title, sub, src = null, spotify = null, compact = false }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play();
  };

  const seek = (e) => {
    const a = audioRef.current;
    const rail = trackRef.current;
    if (!a || !rail || !isFinite(a.duration)) return;
    const r = rail.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    a.currentTime = f * a.duration;
  };

  // Spotify link (current default: no files yet)
  if (!src && spotify) {
    return (
      <a
        className={`player player-link${compact ? " is-compact" : ""}`}
        href={spotify}
        target="_blank"
        rel="noreferrer"
        data-cursor="Listen"
        aria-label={`Listen to ${title} on Spotify`}
      >
        <span className="player-btn" aria-hidden>
          <Triangle />
        </span>
        {!compact && (
          <span className="player-meta">
            <span className="player-title">{title}</span>
            {sub && <span className="player-sub">{sub}</span>}
          </span>
        )}
        <span className="player-cta">
          Listen on Spotify <span aria-hidden>↗</span>
        </span>
      </a>
    );
  }

  // Inline file playback
  return (
    <div className="player" data-cursor={src ? "Play" : undefined}>
      <button
        className="player-btn"
        onClick={toggle}
        disabled={!src}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      >
        {playing ? (
          <svg viewBox="0 0 16 16" aria-hidden>
            <rect x="3" y="2" width="3.5" height="12" />
            <rect x="9.5" y="2" width="3.5" height="12" />
          </svg>
        ) : (
          <Triangle />
        )}
      </button>

      <div className="player-meta">
        <div className="player-title">{title}</div>
        {sub && <div className="player-sub">{sub}</div>}
      </div>

      {src ? (
        <>
          <div className="player-track" ref={trackRef} onClick={seek}>
            <div className="player-rail" />
            <div className="player-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="player-time">
            {fmt(time)} / {fmt(duration)}
          </div>
          <audio
            ref={audioRef}
            src={src}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onTimeUpdate={(e) => {
              setTime(e.target.currentTime);
              setProgress(e.target.duration ? e.target.currentTime / e.target.duration : 0);
            }}
          />
        </>
      ) : (
        <span className="player-coming">Audio coming</span>
      )}
    </div>
  );
}
