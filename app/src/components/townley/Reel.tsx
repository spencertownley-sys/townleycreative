import { clsx } from "clsx";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";

import { QUOTE_HREF, REEL } from "../../site";
import { NeonSign } from "./NeonSign";
import { TubeButton } from "./TubeButton";

/*
 * Reel theatre mode ("Lights down"). Pressing Play flickers the neon sign off,
 * closes letterbox bars in from top and bottom, and plays the reel in a scope
 * frame. Lights up (close, Esc, or the end card) strikes the sign back on.
 * The page states live on <html data-theatre>: dim → on → return.
 */

type TheatreHandle = { open: () => void };
type ReelApi = { open: () => void; warm: () => void };

const ReelContext = createContext<ReelApi | null>(null);

export function useReel(): ReelApi {
  const api = useContext(ReelContext);
  if (!api) throw new Error("useReel must be used inside <ReelProvider>");
  return api;
}

export function ReelProvider({ children }: { children: ReactNode }) {
  const theatre = useRef<TheatreHandle>(null);
  const [warm, setWarm] = useState(false);
  const api = useMemo<ReelApi>(
    () => ({
      open: () => {
        setWarm(true);
        theatre.current?.open();
      },
      warm: () => setWarm(true),
    }),
    [],
  );
  return (
    <ReelContext.Provider value={api}>
      {children}
      <ReelTheatre ref={theatre} warm={warm} />
    </ReelContext.Provider>
  );
}

const DIM_MS = 280;
const RETURN_MS = 1400;

function setTheatre(state: "dim" | "on" | "return" | null) {
  const root = document.documentElement;
  if (state) root.dataset.theatre = state;
  else delete root.dataset.theatre;
}

/** 24fps timecode: HH:MM:SS:FF. */
function timecode(t: number) {
  const s = Math.max(0, t);
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  return `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad((s % 1) * 24)}`;
}

function ReelTheatre({ ref, warm }: { ref: Ref<TheatreHandle>; warm: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(!REEL.hasAudio);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      delete document.documentElement.dataset.theatre;
    },
    [],
  );

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setEnded(false);
    void video.play().catch(() => setPlaying(false));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        const dialog = dialogRef.current;
        const video = videoRef.current;
        if (!dialog || !video || dialog.open) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        timers.current.forEach(clearTimeout);
        setEnded(false);
        setTheatre("dim");
        later(
          () => {
            dialog.showModal();
            setTheatre("on");
            video.currentTime = 0;
            play();
          },
          reduced ? 0 : DIM_MS,
        );
      },
    }),
    [play],
  );

  const lightsUp = () => dialogRef.current?.close();

  const onClose = () => {
    videoRef.current?.pause();
    setPlaying(false);
    setTheatre("return");
    later(() => setTheatre(null), RETURN_MS);
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) play();
    else video.pause();
  };

  const seek = (to: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, to), video.duration || to);
    setTime(video.currentTime);
    if (ended && to < (video.duration || 0)) setEnded(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    const inControl = target.closest("button, a, input");
    if ((e.key === " " || e.key === "k") && !inControl) {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight" && target.tagName !== "INPUT") {
      seek((videoRef.current?.currentTime ?? 0) + 5);
    } else if (e.key === "ArrowLeft" && target.tagName !== "INPUT") {
      seek((videoRef.current?.currentTime ?? 0) - 5);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={clsx("tc-theatre", ended && "is-ended")}
      aria-label="Townley Creative reel"
      onClose={onClose}
      onKeyDown={onKeyDown}
    >
      <div className="tc-theatre__dark" aria-hidden="true" />
      <div className="tc-theatre__bar tc-theatre__bar--top">
        <div className="tc-theatre__top">
          <p className="tc-theatre__title">
            <span className="tc-mono">Townley Creative</span>
            <span className="tc-theatre__runtime tc-mono">Reel · {REEL.runtime}</span>
          </p>
          <button type="button" className="tc-theatre__close" onClick={lightsUp}>
            <span>Lights up</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="tc-theatre__frame">
        <video
          ref={videoRef}
          className="tc-theatre__video"
          poster={REEL.poster}
          preload={warm ? "auto" : "none"}
          playsInline
          muted={muted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
          }}
          onClick={toggle}
        >
          {REEL.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
        {ended ? (
          <div className="tc-theatre__end">
            <NeonSign className="tc-theatre__sign" flicker={false} strike={false} />
            <div className="tc-theatre__end-actions">
              <TubeButton
                variant="outline"
                onClick={() => {
                  seek(0);
                  play();
                }}
              >
                Watch again
              </TubeButton>
              <TubeButton variant="fill" href={QUOTE_HREF}>
                Get a quote
              </TubeButton>
            </div>
          </div>
        ) : null}
      </div>

      <div className="tc-theatre__bar tc-theatre__bar--bottom">
        <div className="tc-theatre__controls">
          <button
            type="button"
            className="tc-theatre__play"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5z" />
              </svg>
            )}
          </button>
          <span className="tc-theatre__tc tc-mono" aria-hidden="true">
            {timecode(time)}
          </span>
          <input
            type="range"
            className="tc-theatre__scrub"
            min={0}
            max={duration || 1}
            step={0.04}
            value={time}
            onChange={(e) => seek(Number(e.currentTarget.value))}
            aria-label="Seek"
            aria-valuetext={`${Math.floor(time)} of ${Math.floor(duration)} seconds`}
            style={{ "--progress": `${duration ? (time / duration) * 100 : 0}%` } as CSSProperties}
          />
          <span className="tc-theatre__tc tc-theatre__tc--total tc-mono" aria-hidden="true">
            {timecode(duration)}
          </span>
          {REEL.hasAudio ? (
            <button
              type="button"
              className="tc-theatre__mute tc-mono"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
            >
              {muted ? "Sound off" : "Sound on"}
            </button>
          ) : null}
        </div>
        {REEL.isConcept ? (
          <p className="tc-theatre__note">
            Concept reel: cut from frames we generated with Higgsfield. Real client work replaces it
            as it ships.
          </p>
        ) : null}
      </div>
    </dialog>
  );
}

type PlayReelButtonProps = {
  variant?: "fill" | "outline" | "text";
  className?: string;
  children?: ReactNode;
};

/** Opens theatre mode; starts loading the reel on hover or focus. */
export function PlayReelButton({ variant = "text", className, children }: PlayReelButtonProps) {
  const { open, warm } = useReel();
  return (
    <TubeButton
      variant={variant}
      className={clsx("tc-reel-btn", className)}
      onClick={open}
      onPointerEnter={warm}
      onFocus={warm}
    >
      <svg className="tc-reel-btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5z" />
      </svg>
      {children ?? (
        <>
          Play reel <span className="tc-reel-btn__time">{REEL.runtime}</span>
        </>
      )}
    </TubeButton>
  );
}

/** The big poster in the Work section that opens the theatre. */
export function ReelCard() {
  const { open, warm } = useReel();
  return (
    <button
      type="button"
      className="tc-reelcard"
      onClick={open}
      onPointerEnter={warm}
      onFocus={warm}
      aria-label={`Play the ${REEL.isConcept ? "concept " : ""}reel, ${REEL.runtime}`}
    >
      <img
        className="tc-reelcard__poster"
        src={REEL.poster}
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
      />
      <span className="tc-reelcard__shade" aria-hidden="true" />
      <span className="tc-reelcard__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5z" />
        </svg>
      </span>
      <span className="tc-reelcard__meta" aria-hidden="true">
        <span className="tc-reelcard__title">Lights down</span>
        <span className="tc-mono">
          Reel · {REEL.runtime}
          {REEL.isConcept ? " · concept cut" : ""}
        </span>
      </span>
    </button>
  );
}
