"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { careers } from "@/content/site";
import { burst } from "@/lib/toast";
import { cx } from "@/lib/utils";
import s from "./watering.module.css";

/**
 * Careers: hover the can and it tilts, pouring droplets on a closed daisy.
 * Click and the daisy blooms open and the application form appears.
 * A plain "apply" button does the same thing for keyboard and screen-reader users.
 */
export function WateringGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const formId = useId();
  const panel = useRef<HTMLDivElement>(null);

  const reveal = (e?: React.MouseEvent) => {
    setOpen(true);
    if (e) burst(e.clientX, e.clientY, 18);
    requestAnimationFrame(() => {
      panel.current?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className={cx(s.gate, open && s.open)}>
      <div className={s.garden}>
        <button type="button" className={s.can} onClick={reveal} aria-controls={formId} aria-expanded={open} aria-label="water the daisy to open the application">
          <svg viewBox="0 0 160 110" aria-hidden="true">
            <path d="M30 40h70l-5 60H35z" fill="#c9b6f0" stroke="#2a1a4a" strokeWidth="3" strokeLinejoin="round" />
            <path d="M100 55l50-30 4 6-50 39z" fill="#c9b6f0" stroke="#2a1a4a" strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="152" cy="27" rx="6" ry="9" transform="rotate(-30 152 27)" fill="#e6ddf7" stroke="#2a1a4a" strokeWidth="2.5" />
            <path d="M45 40q20-35 40 0" fill="none" stroke="#2a1a4a" strokeWidth="5" strokeLinecap="round" />
            <g transform="translate(65 70)" fill="#fffbf5" stroke="#2a1a4a" strokeWidth="1.5">
              {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cy="-9" rx="4" ry="7" transform={`rotate(${r})`} />)}
              <circle r="4.5" fill="#ffd75e" />
            </g>
          </svg>
        </button>
        <div className={s.drops} aria-hidden="true"><i /><i /><i /><i /></div>

        <div className={s.flower} aria-hidden="true">
          <svg viewBox="0 0 100 160">
            <path d="M50 160V70" stroke="#22a35a" strokeWidth="5" strokeLinecap="round" />
            <path d="M50 120c-16-8-26-2-30 8 12 5 22 2 30-8z" fill="#4ade80" stroke="#2a1a4a" strokeWidth="2" />
            <path d="M50 105c16-8 26-2 30 8-12 5-22 2-30-8z" fill="#4ade80" stroke="#2a1a4a" strokeWidth="2" />
            <g className={s.head}>
              <g transform="translate(50 50)" fill="#fffbf5" stroke="#2a1a4a" strokeWidth="2.5">
                {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((r) => (
                  <ellipse key={r} className={s.petal} cy="-20" rx="8" ry="17" transform={`rotate(${r})`} />
                ))}
              </g>
              <circle cx="50" cy="50" r="11" fill="#ffd75e" stroke="#2a1a4a" strokeWidth="2.5" />
            </g>
          </svg>
        </div>
        <div className={s.soil} aria-hidden="true" />
        <span className={s.hint} aria-hidden="true">{careers.hint}</span>
      </div>

      {!open && (
        <button type="button" className={s.applyLink} onClick={() => reveal()} aria-controls={formId} aria-expanded={open}>
          {careers.applyLink}
        </button>
      )}

      <div id={formId} ref={panel} className={s.panel} hidden={!open}>
        {children}
      </div>
    </div>
  );
}
