"use client";

import dynamic from "next/dynamic";

const HeroStage = dynamic(() => import("./glasses/HeroStage"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-stage">
        <HeroStage />
      </div>

      <div className="hero-inner shell">
        <p className="eyebrow hero-eyebrow">Est. 1987 — Marylebone, London</p>

        <h1 className="hero-title display">
          See the
          <br />
          world <em>differently.</em>
        </h1>

        <div className="hero-bottom">
          <div className="hero-note">
            <p className="micro">Prescription eyewear</p>
            <p className="hero-note-body">
              Five house frames, hand-finished in London. Glazed to your eyes,
              adjusted to your face, kept for life.
            </p>
            <a className="link-arrow" href="#atelier">
              Enter the atelier <span aria-hidden="true">↘</span>
            </a>
          </div>

          <div className="seal" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path
                  id="seal-circle"
                  d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
                />
              </defs>
              <text className="seal-text">
                <textPath href="#seal-circle">
                  Handmade in London · Est. 1987 · Handmade in London · Est.
                  1987 ·
                </textPath>
              </text>
              <circle cx="60" cy="60" r="2.6" className="seal-dot" />
              <circle
                cx="60"
                cy="60"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.28"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-foot shell">
        <div className="hero-facts">
          <div className="hero-fact">
            <span className="micro">House frames</span>
            <span className="fact">05</span>
          </div>
          <div className="hero-fact">
            <span className="micro">Stages of polish</span>
            <span className="fact">14</span>
          </div>
          <div className="hero-fact">
            <span className="micro">Adjustments, for life</span>
            <span className="fact">∞</span>
          </div>
        </div>

        <a className="scroll-cue" href="#atelier">
          <span className="micro">Scroll</span>
          <span className="scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
