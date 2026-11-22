"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FRAMES, type FrameId, getFrame, type TintId } from "@/lib/frames";
import { soundFx } from "@/lib/sound";

const AtelierStage = dynamic(() => import("./glasses/AtelierStage"), {
  ssr: false,
});

interface SplitStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFrameAId: FrameId;
  onAddToBag: (frameId: FrameId) => void;
}

export default function SplitStageModal({
  isOpen,
  onClose,
  initialFrameAId,
  onAddToBag,
}: SplitStageModalProps) {
  const [frameAId, setFrameAId] = useState<FrameId>(initialFrameAId);
  const [frameBId, setFrameBId] = useState<FrameId>("solstice");
  const [tintA, setTintA] = useState<TintId>("clear");
  const [tintB, setTintB] = useState<TintId>("sepia");

  if (!isOpen) return null;

  const frameA = getFrame(frameAId);
  const frameB = getFrame(frameBId);

  return (
    <div className="split-stage-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="split-stage-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="split-stage-head">
          <div>
            <span className="micro kicker">✦ Realtime 3D Differential Analysis</span>
            <h2 className="display">Quick-Compare Split Stage</h2>
          </div>
          <button
            type="button"
            className="split-stage-close"
            onClick={onClose}
            aria-label="Close Comparison"
          >
            ✕
          </button>
        </div>

        {/* Dual 3D Stages Side by Side */}
        <div className="split-stage-grid">
          {/* Frame A Stage */}
          <div className="split-stage-col">
            <div className="split-stage-selector-bar">
              <div>
                <span className="micro kicker">Specimen 01</span>
                <select
                  value={frameAId}
                  onChange={(e) => {
                    soundFx.playClick();
                    setFrameAId(e.target.value as FrameId);
                  }}
                  className="split-frame-select"
                >
                  {FRAMES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.origin === "indian" ? "🇮🇳" : "🇬🇧"} {f.name} (£{f.price})
                    </option>
                  ))}
                </select>
              </div>
              <span className="panel-price">£{frameA.price}</span>
            </div>

            <div className="split-3d-box">
              <AtelierStage
                config={{
                  frameId: frameA.id,
                  colourId: frameA.colours[0].id,
                  tintId: tintA,
                  lensTypeId: "anti-glare",
                }}
              />
              <span className="micro stage-hint">Interactive 360° View</span>
            </div>

            <div className="split-frame-meta">
              <h3 className="display">{frameA.name}</h3>
              <p className="micro text-brass">{frameA.tagline}</p>
              <button
                type="button"
                className="btn btn-ink btn-sm btn-block"
                onClick={() => {
                  soundFx.playClick();
                  onAddToBag(frameA.id);
                }}
                style={{ marginTop: "12px" }}
              >
                Add {frameA.name} to Bag +
              </button>
            </div>
          </div>

          {/* Divider VS indicator */}
          <div className="split-stage-divider">
            <span className="vs-badge">VS</span>
          </div>

          {/* Frame B Stage */}
          <div className="split-stage-col">
            <div className="split-stage-selector-bar">
              <div>
                <span className="micro kicker">Specimen 02</span>
                <select
                  value={frameBId}
                  onChange={(e) => {
                    soundFx.playClick();
                    setFrameBId(e.target.value as FrameId);
                  }}
                  className="split-frame-select"
                >
                  {FRAMES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.origin === "indian" ? "🇮🇳" : "🇬🇧"} {f.name} (£{f.price})
                    </option>
                  ))}
                </select>
              </div>
              <span className="panel-price">£{frameB.price}</span>
            </div>

            <div className="split-3d-box">
              <AtelierStage
                config={{
                  frameId: frameB.id,
                  colourId: frameB.colours[0].id,
                  tintId: tintB,
                  lensTypeId: "blue-cut",
                }}
              />
              <span className="micro stage-hint">Interactive 360° View</span>
            </div>

            <div className="split-frame-meta">
              <h3 className="display">{frameB.name}</h3>
              <p className="micro text-brass">{frameB.tagline}</p>
              <button
                type="button"
                className="btn btn-ink btn-sm btn-block"
                onClick={() => {
                  soundFx.playClick();
                  onAddToBag(frameB.id);
                }}
                style={{ marginTop: "12px" }}
              >
                Add {frameB.name} to Bag +
              </button>
            </div>
          </div>
        </div>

        {/* Technical Differential Comparison Matrix */}
        <div className="split-comparison-matrix">
          <span className="micro kicker">Side-by-Side Blueprint Differential</span>
          <div className="diff-table">
            <div className="diff-row diff-header-row">
              <span>Metric</span>
              <strong>{frameA.name}</strong>
              <strong>{frameB.name}</strong>
            </div>

            <div className="diff-row">
              <span className="diff-label">Series Origin</span>
              <span>{frameA.origin === "indian" ? "🇮🇳 Indian Heritage" : "🇬🇧 International"}</span>
              <span>{frameB.origin === "indian" ? "🇮🇳 Indian Heritage" : "🇬🇧 International"}</span>
            </div>

            <div className="diff-row">
              <span className="diff-label">Material Craft</span>
              <span>{frameA.material === "acetate" ? "Cellulose Block Acetate" : "Japanese Beta-Titanium"}</span>
              <span>{frameB.material === "acetate" ? "Cellulose Block Acetate" : "Japanese Beta-Titanium"}</span>
            </div>

            <div className="diff-row">
              <span className="diff-label">Lens Diameter</span>
              <span>{frameA.specs.lens}</span>
              <span>{frameB.specs.lens}</span>
            </div>

            <div className="diff-row">
              <span className="diff-label">Bridge Width</span>
              <span>{frameA.specs.bridge}</span>
              <span>{frameB.specs.bridge}</span>
            </div>

            <div className="diff-row">
              <span className="diff-label">Total Mass</span>
              <span className="text-brass">{frameA.specs.weight}</span>
              <span className="text-brass">{frameB.specs.weight}</span>
            </div>

            <div className="diff-row">
              <span className="diff-label">Recommended Fits</span>
              <span className="micro">{frameA.fit.join(", ").toUpperCase()}</span>
              <span className="micro">{frameB.fit.join(", ").toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
