"use client";

import { useEffect, useState } from "react";
import FrameThumb from "./FrameThumb";
import Reveal from "./Reveal";
import {
  COLLECTIONS,
  FRAMES,
  type CollectionId,
  type Frame,
  type FrameId,
  type OriginId,
} from "@/lib/frames";

interface CollectionsSectionProps {
  onSelectFrame: (id: FrameId) => void;
  onQuickAdd: (frameId: FrameId) => void;
}

export default function CollectionsSection({
  onSelectFrame,
  onQuickAdd,
}: CollectionsSectionProps) {
  const [activeOrigin, setActiveOrigin] = useState<OriginId | "all">("all");
  const [activeCollection, setActiveCollection] = useState<CollectionId>("all");
  const [activeColours, setActiveColours] = useState<Record<string, string>>({});

  const getFrameThumbColor = (frame: (typeof FRAMES)[number]) => {
    if (activeColours[frame.id]) return activeColours[frame.id];
    if (frame.id === "circle") return "#d4af37";
    if (frame.id === "rectangle") return "#ff2a4d";
    if (frame.id === "oval") return "#f472b6";
    if (frame.id === "round") return "#eab308";
    if (frame.id === "retro") return "#f97316";
    if (frame.id === "aviator") return "#eab308";
    const bright = frame.colours.find(
      (c) =>
        c.metal ||
        (c.hex !== "#171717" &&
          c.hex !== "#19191d" &&
          c.hex !== "#232323" &&
          c.hex !== "#211f1c" &&
          c.hex !== "#1c1c22")
    );
    return bright ? bright.hex : "#ff2a4d";
  };

  // Listen to hash changes for #collections-international and #collections-indian
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#collections-international") {
        setActiveOrigin("international");
        setActiveCollection("all");
      } else if (hash === "#collections-indian") {
        setActiveOrigin("indian");
        setActiveCollection("all");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const filteredFrames = FRAMES.filter((f) => {
    const matchesOrigin = activeOrigin === "all" || f.origin === activeOrigin;
    const matchesCollection =
      activeCollection === "all" ||
      (activeCollection === "international" && f.origin === "international") ||
      (activeCollection === "indian" && f.origin === "indian") ||
      f.collection === activeCollection;

    return matchesOrigin && matchesCollection;
  });

  const intlCount = FRAMES.filter((f) => f.origin === "international").length;
  const indianCount = FRAMES.filter((f) => f.origin === "indian").length;

  return (
    <section id="collections" className="section collections">
      {/* Invisible anchor points for deep linking */}
      <div id="collections-international" style={{ position: "relative", top: "-100px" }} />
      <div id="collections-indian" style={{ position: "relative", top: "-100px" }} />

      <div className="shell">
        <Reveal>
          <header className="section-head">
            <div className="section-kicker">
              <span>02</span>
              <span>The Collections Archive</span>
            </div>
            <h2 className="display section-title">
              Sixteen curated silhouettes.
              <br />
              <em>Handcrafted across London, Sabae & India.</em>
            </h2>
            <p className="section-lede">
              Explore our dual 2026 series: The founding <strong>International Archive</strong> with
              British pantos & Japanese titanium, alongside our newly unveiled <strong>Indian Heritage</strong> collection
              celebrating architectural Madras acetate, pure wire circles, and vintage Bombay browlines.
            </p>
          </header>
        </Reveal>

        {/* Primary Origin Navigation Switcher (International vs Indian) */}
        <div className="origin-nav-wrapper">
          <div className="origin-nav-tabs" role="tablist" aria-label="Regional Collections">
            <button
              type="button"
              role="tab"
              aria-selected={activeOrigin === "all"}
              className={`origin-tab ${activeOrigin === "all" ? "is-active" : ""}`}
              onClick={() => {
                setActiveOrigin("all");
                setActiveCollection("all");
              }}
            >
              <span className="origin-icon">✦</span>
              <span className="origin-label">All Silhouettes</span>
              <span className="origin-badge">16</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeOrigin === "international"}
              className={`origin-tab origin-intl ${activeOrigin === "international" ? "is-active" : ""}`}
              onClick={() => {
                setActiveOrigin("international");
                setActiveCollection("all");
              }}
            >
              <span className="origin-icon">🇬🇧</span>
              <span className="origin-label">International Frames</span>
              <span className="origin-badge">{intlCount}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeOrigin === "indian"}
              className={`origin-tab origin-india ${activeOrigin === "indian" ? "is-active" : ""}`}
              onClick={() => {
                setActiveOrigin("indian");
                setActiveCollection("all");
              }}
            >
              <span className="origin-icon">🇮🇳</span>
              <span className="origin-label">Indian Heritage Frames</span>
              <span className="origin-badge">{indianCount}</span>
            </button>
          </div>

          <div className="origin-notice-pill">
            {activeOrigin === "international" && (
              <span>Showing 10 International Archive Frames · British & Japanese beta-titanium craftsmanship</span>
            )}
            {activeOrigin === "indian" && (
              <span>Showing 6 Indian Heritage Frames · Rectangle, Circle, Oval, Round, Bombay Retro & Garuda Aviator</span>
            )}
            {activeOrigin === "all" && (
              <span>Displaying Complete Atelier Archive · 10 International + 6 Indian Heritage Frames</span>
            )}
          </div>
        </div>

        {/* Sub-Collection Material/Style Filter Tabs */}
        <div className="collections-filter-wrap">
          <div className="collections-tabs" role="tablist" aria-label="Material Sub-collections">
            {COLLECTIONS.filter((c) => c.id !== "international" && c.id !== "indian").map((col) => {
              const count =
                col.id === "all"
                  ? filteredFrames.length
                  : filteredFrames.filter((f) => f.collection === col.id).length;

              return (
                <button
                  key={col.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCollection === col.id}
                  className={`collection-tab ${activeCollection === col.id ? "is-active" : ""}`}
                  onClick={() => setActiveCollection(col.id)}
                >
                  <span className="col-tab-name">{col.name}</span>
                  <span className="col-tab-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Frames Grid */}
        <div className="collections-grid">
          {filteredFrames.map((frame, index) => (
            <Reveal key={frame.id} delay={index * 50}>
              <div className="col-card">
                <div className="col-card-head">
                  <span className="micro col-idx">Plate {frame.index}</span>
                  <div className="col-badge-cluster">
                    <span className={`micro origin-badge-tag ${frame.origin === "indian" ? "tag-india" : "tag-intl"}`}>
                      {frame.origin === "indian" ? "🇮🇳 Indian" : "🇬🇧 International"}
                    </span>
                    <span className="micro col-material-tag">
                      {frame.material === "acetate" ? "Acetate" : "Titanium"}
                    </span>
                  </div>
                </div>

                <div
                  className="col-card-thumb-wrap"
                  onClick={() => onSelectFrame(frame.id)}
                  role="button"
                  tabIndex={0}
                  title={`View ${frame.name} in 3D Atelier`}
                >
                  <FrameThumb
                    frame={frame}
                    strokeColor={getFrameThumbColor(frame)}
                    className="col-thumb"
                  />
                  <span className="thumb-hover-label">Turn in 3D ↺</span>
                </div>

                <div className="col-card-info">
                  <div className="col-card-title-row">
                    <div>
                      <h3 className="col-card-title display">{frame.name}</h3>
                      <p className="col-card-tagline">{frame.tagline}</p>
                    </div>
                    <span className="col-card-price">£{frame.price}</span>
                  </div>

                  <p className="col-card-desc micro">{frame.description}</p>

                  <div className="col-card-specs micro">
                    <span>{frame.specs.lens} lens</span>
                    <span>{frame.specs.bridge} bridge</span>
                    <span>{frame.specs.weight}</span>
                  </div>

                  <div className="col-card-colours">
                    <span className="micro">Finishes:</span>
                    <div className="col-swatch-list">
                      {frame.colours.map((c) => {
                        const isCurrent = getFrameThumbColor(frame) === c.hex;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            className={`mini-swatch ${isCurrent ? "is-active" : ""}`}
                            style={{
                              backgroundColor: c.hex,
                              transform: isCurrent ? "scale(1.28)" : undefined,
                              boxShadow: isCurrent
                                ? "0 0 8px rgba(255, 30, 66, 0.8), 0 0 0 2px #fff"
                                : undefined,
                            }}
                            title={`${c.name} (Click to preview)`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveColours((prev) => ({
                                ...prev,
                                [frame.id]: c.hex,
                              }));
                            }}
                            onMouseEnter={() => {
                              setActiveColours((prev) => ({
                                ...prev,
                                [frame.id]: c.hex,
                              }));
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-card-actions">
                    <button
                      type="button"
                      className="btn btn-ink btn-sm"
                      onClick={() => onSelectFrame(frame.id)}
                    >
                      3D Customizer ↗
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={() => onQuickAdd(frame.id)}
                    >
                      Add to Bag +
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
