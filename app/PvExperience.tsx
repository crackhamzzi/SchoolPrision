"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { pvBeats, totalPvDuration } from "./pv-sequence";

type PvExperienceProps = {
  onCancel: () => void;
  onEnterSite: () => void;
  onComplete: () => void;
};

const formatTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

const stripSentenceMarks = (text: string) => text.replace(/[.,]/g, "");

export default function PvExperience({ onCancel, onEnterSite, onComplete }: PvExperienceProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const callbacks = useRef({ onCancel, onEnterSite, onComplete });
  const closeButton = useRef<HTMLButtonElement>(null);
  const handoffStarted = useRef(false);
  const completed = useRef(false);
  const beat = pvBeats[index];

  const elapsedBeforeBeat = useMemo(
    () => pvBeats.slice(0, index).reduce((total, item) => total + item.duration, 0),
    [index],
  );
  const progress = ((elapsedBeforeBeat + beat.duration * 0.18) / totalPvDuration) * 100;

  useEffect(() => {
    callbacks.current = { onCancel, onEnterSite, onComplete };
  }, [onCancel, onComplete, onEnterSite]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !handoffStarted.current) callbacks.current.onCancel();
      if (event.key === " " && event.target === document.body) {
        event.preventDefault();
        setPaused((current) => !current);
      }
      if (event.key === "ArrowRight") setIndex((current) => Math.min(pvBeats.length - 1, current + 1));
      if (event.key === "ArrowLeft") setIndex((current) => Math.max(0, current - 1));
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    closeButton.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const nextImages = pvBeats.slice(index + 1, index + 3).flatMap((item) => [item.image, item.titleUpper, item.titleLower].filter((source): source is string => Boolean(source)));
    nextImages.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, [index]);

  useEffect(() => {
    if (paused) return;
    const duration = reducedMotion ? Math.max(1700, Math.round(beat.duration * 0.62)) : beat.duration;

    if (index < pvBeats.length - 1) {
      const timer = window.setTimeout(() => setIndex((current) => current + 1), duration);
      return () => window.clearTimeout(timer);
    }

    const enterTimer = window.setTimeout(() => {
      if (handoffStarted.current) return;
      handoffStarted.current = true;
      callbacks.current.onEnterSite();
    }, Math.max(900, duration - 1350));
    const completeTimer = window.setTimeout(() => {
      if (completed.current) return;
      completed.current = true;
      callbacks.current.onComplete();
    }, duration);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(completeTimer);
    };
  }, [beat.duration, index, paused, reducedMotion]);

  const cancel = () => {
    if (!handoffStarted.current) callbacks.current.onCancel();
  };

  const skipToFinale = () => {
    setPaused(false);
    setIndex(pvBeats.length - 1);
  };

  const move = (direction: -1 | 1) => {
    setIndex((current) => Math.max(0, Math.min(pvBeats.length - 1, current + direction)));
  };

  const accessibleCopy = [
    beat.narration ? stripSentenceMarks(beat.narration) : undefined,
    ...(beat.lines?.map((line) => `${line.speaker}: ${stripSentenceMarks(line.text)}`) ?? []),
  ].filter(Boolean).join(" ");

  return (
    <section
      className={`prison-pv prison-pv--${beat.kind} prison-pv-emphasis-${beat.emphasis ?? "quiet"} prison-pv-beat-${beat.id} ${paused ? "is-paused" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="학교라는 이름의 감옥 프롤로그 PV"
      style={{ "--pv-progress": `${Math.min(100, progress)}%`, "--pv-beat-duration": `${beat.duration}ms` } as CSSProperties}
    >
      <div className="prison-pv-grain" aria-hidden="true" />
      <div className="prison-pv-scanlines" aria-hidden="true" />
      <div className="prison-pv-vignette" aria-hidden="true" />

      <header className="prison-pv-hud" aria-hidden="true">
        <span>한빛고등학교 비공개 기록</span>
        <b>프롤로그</b>
        <span>장면 {index + 1} / {pvBeats.length}</span>
      </header>

      <div className="prison-pv-controls">
        <button type="button" onClick={() => move(-1)} disabled={index === 0} aria-label="이전 장면">이전</button>
        <button type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? "PV 재생" : "PV 일시정지"}>{paused ? "재생" : "일시정지"}</button>
        <button type="button" onClick={() => move(1)} disabled={index === pvBeats.length - 1} aria-label="다음 장면">다음</button>
        {index < pvBeats.length - 1 && <button type="button" onClick={skipToFinale}>마지막</button>}
        <button ref={closeButton} type="button" onClick={cancel} aria-label="PV 닫기">닫기</button>
      </div>

      <div className="prison-pv-progress" aria-hidden="true"><i /></div>
      <div className="prison-pv-time" aria-hidden="true"><span>{formatTime(elapsedBeforeBeat)}</span><span>{formatTime(totalPvDuration)}</span></div>

      <article className="prison-pv-stage" key={beat.id} aria-hidden="true">
        {beat.kind === "image" && beat.image && (
          <div className="prison-pv-image" data-motion={beat.motion ?? "push"}>
            <img src={beat.image} alt="" style={{ objectPosition: beat.focus ?? "50% 50%" }} />
          </div>
        )}

        {beat.kind === "title" && beat.titleUpper && beat.titleLower && (
          <div className="prison-pv-title" role="img" aria-label="학교라는 이름의 감옥 완전판">
            <div className="prison-pv-title-mark" aria-hidden="true">
              <img className="prison-pv-title-half prison-pv-title-half--upper" src={beat.titleUpper} alt="" />
              <img className="prison-pv-title-half prison-pv-title-half--lower" src={beat.titleLower} alt="" />
              <i className="prison-pv-title-rule" />
            </div>
          </div>
        )}

        {beat.narration && (
          <p className="prison-pv-narration">
            {beat.id === "welcome" ? (
              <span className="prison-pv-typewriter-frame">
                <span className="prison-pv-typewriter-text">{stripSentenceMarks(beat.narration)}</span>
              </span>
            ) : stripSentenceMarks(beat.narration)}
          </p>
        )}

        {beat.lines && (
          <div className="prison-pv-dialogues">
            {beat.lines.map((line, lineIndex) => {
              const lineWindow = Math.max(1.35, beat.duration / 1000 / beat.lines!.length);
              return (
                <p
                  className={`prison-pv-dialogue prison-pv-dialogue--${line.tone}`}
                  key={`${line.speaker}-${line.text}`}
                  style={{
                    "--pv-line-delay": `${0.35 + lineIndex * lineWindow}s`,
                    "--pv-line-window": `${Math.min(lineWindow + 0.35, 3.2)}s`,
                  } as CSSProperties}
                >
                  <span>{stripSentenceMarks(line.text)}</span>
                </p>
              );
            })}
          </div>
        )}
      </article>

      <p className="sr-only" aria-live="polite">{accessibleCopy}</p>
      <button className="prison-pv-next-zone" type="button" onClick={() => move(1)} disabled={index === pvBeats.length - 1} aria-label="다음 장면" />
    </section>
  );
}
