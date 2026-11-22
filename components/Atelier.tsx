"use client";

import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import Reveal from "./Reveal";
import {
  FRAMES,
  TINTS,
  LENS_TYPES,
  CYBER_FINISHES,
  type FrameConfig,
  type FrameId,
  type TintId,
  type LensTypeId,
  type OriginId,
  getColour,
  getFrame,
  getTint,
  getLensType,
} from "@/lib/frames";
import { soundFx } from "@/lib/sound";

const AtelierStage = dynamic(() => import("./glasses/AtelierStage"), {
  ssr: false,
});

interface AtelierProps {
  config: FrameConfig;
  onFrameChange: (id: FrameId) => void;
  onColourChange: (id: string) => void;
  onTintChange: (id: TintId) => void;
  onLensTypeChange?: (id: LensTypeId) => void;
  onExplodeToggle?: () => void;
  onEngravingChange?: (text: string) => void;
  onOpenAR?: () => void;
  onOpenCompare?: () => void;
  onAdd: () => void;
}

function swatchStyle(hex: string) {
  return { "--c": hex } as CSSProperties;
}

export default function Atelier({
  config,
  onFrameChange,
  onColourChange,
  onTintChange,
  onLensTypeChange,
  onExplodeToggle,
  onEngravingChange,
  onOpenAR,
  onOpenCompare,
  onAdd,
}: AtelierProps) {
  const [sidebarOrigin, setSidebarOrigin] = useState<OriginId | "all">("all");
  const [activeTab, setActiveTab] = useState<"standard" | "cyber">("cyber");
  const [engravingInput, setEngravingInput] = useState(config.engravedText || "GANESH REDDY · 001");

  const frame = getFrame(config.frameId);
  const colour = getColour(frame, config.colourId);
  const tint = getTint(config.tintId);
  const lensType = getLensType(config.lensTypeId);
  const isAcetate = frame.material === "acetate";

  const displayFrames =
    sidebarOrigin === "all"
      ? FRAMES
      : FRAMES.filter((f) => f.origin === sidebarOrigin);

  const totalPrice = frame.price + (lensType ? lensType.priceDelta : 0);

  const handleEngraveUpdate = (val: string) => {
    setEngravingInput(val);
    if (onEngravingChange) {
      onEngravingChange(val);
    }
  };

  return (
    <section id="atelier" className="section atelier">
      <div className="shell">
        <Reveal>
          <header className="section-head">
            <div className="section-kicker">
              <span>01</span>
              <span>The Atelier & 3D Spatial Studio</span>
            </div>
            <h2 className="display section-title">
              Precision 3D Engineering.
              <br />
              <em>Obsidian & Crimson Atelier.</em>
            </h2>
            <p className="section-lede">
              Explore our real-time 3D spatial studio. Engage exploded blueprint views,
              laser-engrave your name onto the carbon-fiber temples, and preview live reflections
              across aerospace titanium wire and 1.74 aspheric optical glass.
            </p>
          </header>
        </Reveal>

        <div className="studio">
          {/* Frame Index Sidebar */}
          <aside className="studio-index" aria-label="Frame selection">
            <div className="studio-index-top">
              <p className="micro kicker">Silhouettes</p>
              <div className="index-origin-toggle">
                <button
                  type="button"
                  className={`idx-toggle-btn ${sidebarOrigin === "all" ? "is-active" : ""}`}
                  onClick={() => {
                    soundFx.playClick();
                    setSidebarOrigin("all");
                  }}
                >
                  All (16)
                </button>
                <button
                  type="button"
                  className={`idx-toggle-btn ${sidebarOrigin === "international" ? "is-active" : ""}`}
                  onClick={() => {
                    soundFx.playClick();
                    setSidebarOrigin("international");
                  }}
                >
                  🇬🇧 Intl (10)
                </button>
                <button
                  type="button"
                  className={`idx-toggle-btn ${sidebarOrigin === "indian" ? "is-active" : ""}`}
                  onClick={() => {
                    soundFx.playClick();
                    setSidebarOrigin("indian");
                  }}
                >
                  🇮🇳 Indian (6)
                </button>
              </div>
            </div>

            <ol className="frame-list">
              {displayFrames.map((item) => (
                <li
                  key={item.id}
                  className={`frame-item ${item.id === frame.id ? "is-active" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onFrameChange(item.id);
                    }}
                    aria-pressed={item.id === frame.id}
                  >
                    <span className="idx">{item.index}</span>
                    <span className="idx-name">
                      {item.origin === "indian" ? "🇮🇳 " : ""}{item.name}
                    </span>
                    <span className="idx-mat">
                      {item.material === "acetate" ? "Acetate" : "Titanium"}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="index-note">
              Numbered series of 250 specimens across London, Sabae, and Jaipur ateliers.
            </p>
          </aside>

          {/* Center 3D Stage with HUD Tools */}
          <div className="studio-stage">
            <div className="stage-meta">
              <div className="stage-meta-left">
                <span className="micro">
                  Plate {frame.index} · {frame.origin === "indian" ? "Indian Heritage Series" : "International Series"}
                </span>
                <span className="micro stage-hint">Drag to rotate · 360° Realtime</span>
              </div>

              {/* Quick 3D Action Tools */}
              <div className="stage-action-cluster">
                <button
                  type="button"
                  className={`stage-tool-btn ${config.isExploded ? "is-exploded-active" : ""}`}
                  onClick={() => {
                    soundFx.playExplode(!config.isExploded);
                    if (onExplodeToggle) onExplodeToggle();
                  }}
                  title="Toggle 3D Exploded-View Blueprint"
                >
                  <span className="tool-sparkle">✦</span>
                  {config.isExploded ? "Collapse Frame" : "Explode Blueprint"}
                </button>

                {onOpenAR && (
                  <button
                    type="button"
                    className="stage-tool-btn"
                    onClick={() => {
                      soundFx.playClick();
                      onOpenAR();
                    }}
                    title="Open AR Webcam Mirror"
                  >
                    📷 AR Mirror
                  </button>
                )}

                {onOpenCompare && (
                  <button
                    type="button"
                    className="stage-tool-btn"
                    onClick={() => {
                      soundFx.playClick();
                      onOpenCompare();
                    }}
                    title="Compare two frames side-by-side"
                  >
                    ⇄ Split Compare
                  </button>
                )}
              </div>
            </div>

            <div className="stage-canvas">
              <AtelierStage config={config} />

              {!config.isExploded && (
                <>
                  <div className="annot annot-a" aria-hidden="true">
                    <span className="annot-dot" />
                    <span className="annot-line" />
                    <span className="annot-label">
                      <em>Keyhole bridge</em>
                      <span>{isAcetate ? `${frame.specs.bridge} acetate` : "Drawn titanium wire"}</span>
                    </span>
                  </div>

                  <div className="annot annot-b" aria-hidden="true">
                    <span className="annot-line" />
                    <span className="annot-dot" />
                    <span className="annot-label">
                      <em>{isAcetate ? "Hand-polished block" : "Japanese titanium"}</em>
                      <span>{isAcetate ? "14 stages, 3 days" : "14 g featherlight"}</span>
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="stage-specs" aria-label="Frame measurements">
              <div>
                <span className="micro">Lens</span>
                <strong>{frame.specs.lens}</strong>
              </div>
              <div>
                <span className="micro">Bridge</span>
                <strong>{frame.specs.bridge}</strong>
              </div>
              <div>
                <span className="micro">Temple</span>
                <strong>{frame.specs.temple}</strong>
              </div>
              <div>
                <span className="micro">Weight</span>
                <strong>{frame.specs.weight}</strong>
              </div>
            </div>
          </div>

          {/* Right Customizer Panel */}
          <aside className="studio-panel" aria-label="Customisation options">
            <div className="panel-title-row">
              <div>
                <span className="micro kicker">
                  {frame.origin === "indian" ? "🇮🇳 Indian Atelier Design" : "🇬🇧 International Archive"}
                </span>
                <h3 className="display panel-name">{frame.name}</h3>
                <p className="panel-tagline">{frame.tagline}</p>
              </div>
              <span className="panel-price">£{totalPrice}</span>
            </div>

            <p className="panel-desc micro">{frame.description}</p>

            {/* Material Finish Tabs: Heritage vs Cyber-Luxury */}
            <div className="option">
              <div className="material-tabs-row">
                <button
                  type="button"
                  className={`mat-tab-btn ${activeTab === "cyber" ? "is-active" : ""}`}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab("cyber");
                  }}
                >
                  ⚡ Cyber-Luxury Materials
                </button>
                <button
                  type="button"
                  className={`mat-tab-btn ${activeTab === "standard" ? "is-active" : ""}`}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab("standard");
                  }}
                >
                  Classic Finishes
                </button>
              </div>

              <div className="option-head" style={{ marginTop: "10px" }}>
                <span className="micro">Selected Finish</span>
                <span className="option-value">{colour.name}</span>
              </div>

              {activeTab === "cyber" ? (
                <div className="cyber-swatches-grid">
                  {CYBER_FINISHES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`cyber-swatch-card ${option.id === colour.id ? "is-active" : ""}`}
                      onClick={() => {
                        soundFx.playClick();
                        onColourChange(option.id);
                      }}
                      title={option.name}
                    >
                      <span
                        className="cyber-swatch-disc"
                        style={{ backgroundColor: option.hex }}
                      />
                      <span className="cyber-swatch-name">{option.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="swatches">
                  {frame.colours.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`swatch ${option.id === colour.id ? "is-active" : ""}`}
                      onClick={() => {
                        soundFx.playClick();
                        onColourChange(option.id);
                      }}
                      aria-label={option.name}
                      aria-pressed={option.id === colour.id}
                      title={option.name}
                    >
                      <span
                        className="swatch-disc"
                        data-style={
                          option.pattern
                            ? "tortoise"
                            : option.metal
                              ? "metal"
                              : option.translucent
                                ? "translucent"
                                : "solid"
                        }
                        style={swatchStyle(option.hex)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Laser Engraving Input */}
            <div className="option option-laser-engrave">
              <div className="option-head">
                <span className="micro">Laser-Engraved Monogram</span>
                <span className="micro text-crimson">Inner Temple Arm</span>
              </div>
              <div className="engraving-input-wrap">
                <input
                  type="text"
                  maxLength={28}
                  placeholder="e.g. GANESH REDDY · 001"
                  value={engravingInput}
                  onChange={(e) => handleEngraveUpdate(e.target.value)}
                  className="engraving-input"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => soundFx.playLaserEngrave()}
                  title="Test Laser Pulse"
                >
                  ⚡ Laser
                </button>
              </div>
              <p className="micro text-muted" style={{ marginTop: "4px" }}>
                Laser-etched into inner carbon temple with luminescent crimson fill.
              </p>
            </div>

            {/* Lens Tint Swatches */}
            <div className="option">
              <div className="option-head">
                <span className="micro">Lens Tint</span>
                <span className="option-value">{tint.name}</span>
              </div>
              <div className="swatches">
                {TINTS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`swatch ${option.id === tint.id ? "is-active" : ""}`}
                    onClick={() => {
                      soundFx.playClick();
                      onTintChange(option.id);
                    }}
                    aria-label={`${option.name} lens tint`}
                    aria-pressed={option.id === tint.id}
                    title={option.name}
                  >
                    <span
                      className="swatch-disc"
                      data-style="tint"
                      style={swatchStyle(option.hex)}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specialized Glazing Formulation */}
            <div className="option option-lens-type">
              <div className="option-head">
                <span className="micro">Glazing Coating</span>
                <span className="option-value" style={{ color: lensType.accentHex }}>
                  {lensType.badge} (+£{lensType.priceDelta})
                </span>
              </div>
              <div className="lens-pills">
                {LENS_TYPES.map((lt) => {
                  const isActive = (config.lensTypeId || "anti-glare") === lt.id;
                  return (
                    <button
                      key={lt.id}
                      type="button"
                      className={`lens-pill ${isActive ? "is-active" : ""}`}
                      onClick={() => {
                        soundFx.playClick();
                        onLensTypeChange && onLensTypeChange(lt.id);
                      }}
                    >
                      <span className="pill-dot" style={{ backgroundColor: lt.accentHex }} />
                      <span className="pill-name">{lt.name.split(" ")[0]}</span>
                      <span className="pill-cost">+£{lt.priceDelta}</span>
                    </button>
                  );
                })}
              </div>
              <p className="lens-spec-note micro">
                {lensType.tagline}
              </p>
            </div>

            <div className="panel-actions">
              <button
                type="button"
                className="btn btn-ink"
                onClick={() => {
                  soundFx.playClick();
                  onAdd();
                }}
              >
                Add to fitting bag <span aria-hidden="true">·</span> £{totalPrice}
              </button>
              <a className="link-arrow" href="#visit">
                Book a bespoke fitting <span aria-hidden="true">↗</span>
              </a>
            </div>

            <p className="panel-fine">
              Includes {lensType.name} · Laser-Engraved Monogram · Complimentary Global Delivery
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
