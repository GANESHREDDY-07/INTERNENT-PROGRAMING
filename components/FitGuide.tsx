"use client";

import { useState } from "react";
import FrameThumb from "./FrameThumb";
import Reveal from "./Reveal";
import {
  FACES,
  type FaceId,
  type FrameId,
  getFrame,
} from "@/lib/frames";

function FaceIcon({ shape }: { shape: FaceId }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="face-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {shape === "oval" && <ellipse cx="32" cy="32" rx="16.5" ry="22.5" />}
      {shape === "round" && <circle cx="32" cy="32" r="20.5" />}
      {shape === "square" && (
        <rect x="14.5" y="13" width="35" height="38" rx="9" />
      )}
      {shape === "heart" && (
        <path d="M16 23c0-6.5 6.5-9.5 16-9.5S48 16.5 48 23c0 8.5-7 13.5-16 23-9-9.5-16-14.5-16-23Z" />
      )}
      <line x1="32" y1="12" x2="32" y2="52" opacity="0.18" />
      <path d="M23 28c2-1.4 5-1.4 7 0M34 28c2-1.4 5-1.4 7 0" opacity="0.5" />
    </svg>
  );
}

export default function FitGuide({
  onSelectFrame,
}: {
  onSelectFrame: (id: FrameId) => void;
}) {
  const [activeId, setActiveId] = useState<FaceId>("oval");
  const active = FACES.find((face) => face.id === activeId) ?? FACES[0];

  return (
    <section id="fit" className="section fit">
      <div className="shell">
        <Reveal>
          <header className="section-head">
            <div className="section-kicker">
              <span>04</span>
              <span>The Fit</span>
            </div>
            <h2 className="display section-title">
              Frames that
              <br />
              <em>meet your face.</em>
            </h2>
            <p className="section-lede">
              Proportion matters more than rules. Choose a face shape to see
              how we would begin, then come in and let us measure the rest.
            </p>
          </header>
        </Reveal>

        <div className="fit-grid">
          <Reveal>
            <div className="fit-tabs" role="tablist" aria-label="Face shape">
              {FACES.map((face) => (
                <button
                  key={face.id}
                  type="button"
                  role="tab"
                  aria-selected={face.id === activeId}
                  className={`fit-tab ${face.id === activeId ? "is-active" : ""}`}
                  onClick={() => setActiveId(face.id)}
                >
                  <FaceIcon shape={face.id} />
                  <span className="fit-tab-text">
                    <span className="fit-tab-name">{face.name}</span>
                    <span className="fit-tab-note">{face.note}</span>
                  </span>
                  <span className="fit-tab-index">
                    {String(FACES.indexOf(face) + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="fit-result" role="tabpanel">
              <p className="micro">Our starting point</p>
              <h3 className="fit-headline display">{active.headline}</h3>
              <p className="fit-copy">{active.copy}</p>

              <div className="fit-cards">
                {active.recommend.map((id) => {
                  const frame = getFrame(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className="fit-card"
                      onClick={() => onSelectFrame(id)}
                    >
                      <span className="fit-card-thumb">
                        <FrameThumb frame={frame} />
                      </span>
                      <span className="fit-card-head">
                        <span className="fit-card-name">{frame.name}</span>
                        <span className="fit-card-price">£{frame.price}</span>
                      </span>
                      <span className="fit-card-meta">
                        {frame.material === "acetate"
                          ? "Hand-polished acetate"
                          : "Japanese titanium"}{" "}
                        · {frame.specs.lens}
                      </span>
                      <span className="fit-card-link">
                        View in atelier <span aria-hidden="true">↗</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="fit-footnote">
                Fit is only half the story. Book a 30-minute fitting and we will
                photograph the frame on you, adjust the bridge and set the
                temples by hand.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
