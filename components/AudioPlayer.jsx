"use client";

import { useRef, useState } from "react";

/*
 * Inline audio player. Three states:
 * - `src`: plays the file inline, full transport.
 * - `spotify`: no file yet, so the play button opens the track on
 *   Spotify in a new tab and the badge says so.
 * - neither: fully styled, disabled "Audio coming" state.
 */
function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ title, sub, src = null, spotify = null }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play();
    }
  };

  const seek = (e) => {
    const a = audioRef.current;
    const rail = trackRef.current;
    if (!a || !rail || !isFinite(a.duration)) return;
    const r = rail.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    a.currentTime = f * a.duration;
  };

  if (!src && spotify) {
    return (
      <div className="player" data-cursor="Listen">
        <a
          className="player-btn"
          href={spotify}
          target="_blank"
          rel="noreferrer"
          aria-label={`Listen to ${title} on Spotify`}
          style={{ display: "grid", placeItems: "center" }}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M3 1l12 7-12 7z" />
          </svg>
        </a>
        <div className="player-meta">
          <div className="player-title">{title}</div>
          {sub && <div className="player-sub">{sub}</div>}
        </div>
        <span className="player-badge">Listen on Spotify ↗</span>
      </div>
    );
  }

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
            <rect x="2" y="1" width="4" height="14" />
            <rect x="10" y="1" width="4" height="14" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M3 1l12 7-12 7z" />
          </svg>
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
              setProgress(
                e.target.duration ? e.target.currentTime / e.target.duration : 0
              );
            }}
          />
        </>
      ) : (
        <span className="player-badge">Audio coming</span>
      )}
    </div>
  );
}
