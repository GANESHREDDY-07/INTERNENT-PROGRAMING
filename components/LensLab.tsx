"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { LENS_TYPES, type LensTypeId, type TintOption, getLensType } from "@/lib/frames";

const MINUS = "−";

function fmtPower(value: number) {
  const sign = value < 0 ? MINUS : "+";
  return `${sign}${Math.abs(value).toFixed(2)}`;
}

export default function LensLab({ tint }: { tint: TintOption }) {
  const [sph, setSph] = useState(-2.75);
  const [cyl, setCyl] = useState(-0.75);
  const [activeLensType, setActiveLensType] = useState<LensTypeId>("anti-glare");
  const [photochromicSun, setPhotochromicSun] = useState(70);
  const [arEnabled, setArEnabled] = useState(true);

  const absSph = Math.abs(sph);
  const absCyl = Math.abs(cyl);
  const minus = sph < 0;
  const centre = minus ? 1.3 : 1.6 + Math.max(0, sph) * 0.38;
  const edge = minus
    ? 1.2 + absSph * 0.62 + absCyl * 0.45
    : 1.1 + absCyl * 0.28;
  const total = absSph + absCyl;
  const index =
    total >= 4.5 ? "1.74" : total >= 2.5 ? "1.67" : total >= 1 ? "1.60" : "1.50";
  const aspheric = total >= 2.5;

  const CX = 236;
  const CY = 214;
  const H = 96;
  const scale = 8.6;
  const thicknessAt = (yn: number) =>
    (centre + (edge - centre) * Math.pow(Math.abs(yn), 1.65)) * scale;
  const topThickness = thicknessAt(1);

  const samples = 48;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const yn = -1 + (i / samples) * 2;
    const y = CY + yn * H;
    const t = thicknessAt(yn);
    left.push(`${(CX - t / 2).toFixed(2)} ${y.toFixed(2)}`);
    right.push(`${(CX + t / 2).toFixed(2)} ${y.toFixed(2)}`);
  }
  const lensPath = `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;

  return (
    <section id="lens" className="section lab">
      <div className="shell">
        <Reveal>
          <header className="section-head lab-head">
            <div className="section-kicker">
              <span>03</span>
              <span>The Lens Lab</span>
            </div>
            <h2 className="display section-title">
              Ground to
              <br />
              <em>your measure.</em>
            </h2>
            <p className="section-lede">
              A lens is a small piece of engineering. Move the dials to see how
              your prescription changes its geometry — then let us glaze it
              properly.
            </p>
          </header>
        </Reveal>

        <div className="lab-grid">
          <Reveal>
            <div className="lab-copy">
              <p className="lab-intro">
                Prescriptions are personal. Set your sphere and cylinder below;
                we verify every value with your optician before a single cut is
                made.
              </p>

              <div className="dials">
                <div className="dial">
                  <div className="dial-head">
                    <label htmlFor="sph">
                      Sphere <em>SPH</em>
                    </label>
                    <output htmlFor="sph">{fmtPower(sph)}</output>
                  </div>
                  <input
                    id="sph"
                    className="range"
                    type="range"
                    min={-8}
                    max={6}
                    step={0.25}
                    value={sph}
                    onChange={(event) => setSph(Number(event.target.value))}
                  />
                  <div className="dial-scale">
                    <span>{MINUS}8.00</span>
                    <span>Plano</span>
                    <span>+6.00</span>
                  </div>
                </div>

                <div className="dial">
                  <div className="dial-head">
                    <label htmlFor="cyl">
                      Cylinder <em>CYL</em>
                    </label>
                    <output htmlFor="cyl">{fmtPower(cyl)}</output>
                  </div>
                  <input
                    id="cyl"
                    className="range"
                    type="range"
                    min={-4}
                    max={0}
                    step={0.25}
                    value={cyl}
                    onChange={(event) => setCyl(Number(event.target.value))}
                  />
                  <div className="dial-scale">
                    <span>{MINUS}4.00</span>
                    <span>{MINUS}2.00</span>
                    <span>0.00</span>
                  </div>
                </div>
              </div>

              <div className="lab-report" aria-live="polite">
                <div className="report-row">
                  <span>Recommended index</span>
                  <strong>{index}</strong>
                </div>
                <div className="report-row">
                  <span>Profile</span>
                  <strong>{aspheric ? "Aspheric" : "Spherical"}</strong>
                </div>
                <div className="report-row">
                  <span>Estimated edge</span>
                  <strong>{edge.toFixed(1)} mm</strong>
                </div>
                <div className="report-row">
                  <span>Centre thickness</span>
                  <strong>{centre.toFixed(1)} mm</strong>
                </div>
              </div>

              <p className="lab-note">
                {edge > 5.2
                  ? "At this power we recommend a full-rim frame to carry the edge, plus a high-index lens to keep the profile light."
                  : "A mid-index lens keeps this profile comfortable and optically crisp. Any frame in the collection can be glazed to it."}
              </p>

              <a className="link-arrow" href="#visit">
                Book a glazing appointment <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="lab-plate">
              <div className="lab-plate-head">
                <span className="micro">Fig. 03 — Lens profile</span>
                <span className="micro">{tint.name} tint</span>
              </div>

              <div className="lab-readouts">
                <div>
                  <span>Edge</span>
                  <strong>
                    {edge.toFixed(1)}
                    <em>mm</em>
                  </strong>
                </div>
                <div>
                  <span>Centre</span>
                  <strong>
                    {centre.toFixed(1)}
                    <em>mm</em>
                  </strong>
                </div>
                <div>
                  <span>Index</span>
                  <strong>{index}</strong>
                </div>
              </div>

              <svg
                viewBox="0 0 500 420"
                className="lab-svg"
                role="img"
                aria-label={`Lens cross-section for sphere ${fmtPower(sph)} and cylinder ${fmtPower(cyl)}: centre thickness ${centre.toFixed(1)} millimetres, edge thickness ${edge.toFixed(1)} millimetres.`}
              >
                <defs>
                  <pattern
                    id="lab-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M20 0H0V20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.4"
                      opacity="0.12"
                    />
                  </pattern>
                  <linearGradient
                    id="lab-glass"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
                    <stop offset="45%" stopColor={tint.hex} stopOpacity="0.34" />
                    <stop offset="100%" stopColor={tint.hex} stopOpacity="0.58" />
                  </linearGradient>
                  <clipPath id="lab-clip">
                    <path d={lensPath} />
                  </clipPath>
                  <marker
                    id="lab-arrow"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
                  </marker>
                </defs>

                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="420"
                  fill="url(#lab-grid)"
                  color="var(--ink)"
                />

                <line
                  x1="30"
                  y1={CY}
                  x2="470"
                  y2={CY}
                  stroke="currentColor"
                  strokeWidth="0.7"
                  strokeDasharray="2 6"
                  opacity="0.35"
                  color="var(--ink)"
                />
                <line
                  x1={CX}
                  y1="40"
                  x2={CX}
                  y2="392"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  strokeDasharray="2 6"
                  opacity="0.22"
                  color="var(--ink)"
                />

                <circle
                  cx={CX}
                  cy={CY}
                  r="128"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="3 7"
                  opacity="0.24"
                  color="var(--ink)"
                />
                <text
                  x={CX + 96}
                  y={CY - 88}
                  className="svg-label"
                  fill="currentColor"
                  opacity="0.5"
                >
                  Blank Ø 70
                </text>

                <path
                  d={lensPath}
                  fill="url(#lab-glass)"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  color="var(--ink)"
                />

                <g clipPath="url(#lab-clip)">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1={CX - 90 + i * 16}
                      y1={CY + 110}
                      x2={CX + 10 + i * 16}
                      y2={CY - 110}
                      stroke="currentColor"
                      strokeWidth="0.6"
                      opacity="0.14"
                      color="var(--ink)"
                    />
                  ))}
                </g>

                {/* edge dimension */}
                <g color="var(--ink)" opacity="0.7">
                  <line
                    x1={CX - topThickness / 2}
                    y1={CY - H}
                    x2={CX - topThickness / 2}
                    y2={CY - H - 18}
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <line
                    x1={CX + topThickness / 2}
                    y1={CY - H}
                    x2={CX + topThickness / 2}
                    y2={CY - H - 18}
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <line
                    x1={CX - topThickness / 2 - 8}
                    y1={CY - H - 18}
                    x2={CX + topThickness / 2 + 8}
                    y2={CY - H - 18}
                    stroke="currentColor"
                    strokeWidth="0.7"
                    markerStart="url(#lab-arrow)"
                    markerEnd="url(#lab-arrow)"
                  />
                  <text
                    x={CX}
                    y={CY - H - 28}
                    textAnchor="middle"
                    className="svg-label"
                    fill="currentColor"
                  >
                    Edge {edge.toFixed(1)} mm
                  </text>
                </g>

                {/* height dimension */}
                <g color="var(--ink)" opacity="0.7">
                  <line
                    x1={CX + 148}
                    y1={CY - H}
                    x2={CX + 168}
                    y2={CY - H}
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <line
                    x1={CX + 148}
                    y1={CY + H}
                    x2={CX + 168}
                    y2={CY + H}
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <line
                    x1={CX + 164}
                    y1={CY - H - 6}
                    x2={CX + 164}
                    y2={CY + H + 6}
                    stroke="currentColor"
                    strokeWidth="0.7"
                    markerStart="url(#lab-arrow)"
                    markerEnd="url(#lab-arrow)"
                  />
                  <text
                    x={CX + 176}
                    y={CY}
                    className="svg-label"
                    fill="currentColor"
                  >
                    48 mm
                  </text>
                </g>

                <g color="var(--ink)">
                  <circle cx={CX} cy={CY} r="2.4" fill="currentColor" />
                  <line
                    x1={CX}
                    y1={CY}
                    x2={CX + 66}
                    y2={CY + 46}
                    stroke="currentColor"
                    strokeWidth="0.6"
                    opacity="0.5"
                  />
                  <text
                    x={CX + 72}
                    y={CY + 50}
                    className="svg-label"
                    fill="currentColor"
                  >
                    Optical centre
                  </text>
                </g>

                <text
                  x="30"
                  y="386"
                  className="svg-label"
                  fill="currentColor"
                  opacity="0.55"
                >
                  OD · Meridian section · not to scale
                </text>
              </svg>

              <figcaption className="lab-caption">
                Cross-section with thickness exaggerated for legibility.
                Values are approximate — your final lens is chosen during your
                fitting.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* 4 Specialized Atelier Lens Formulations */}
        <div className="lab-lens-catalog">
          <Reveal>
            <div className="lens-catalog-head">
              <span className="micro kicker">Prescription Glazing Options</span>
              <h3 className="display lens-catalog-title">
                Four Master Glazing Formulations.
              </h3>
              <p className="lens-catalog-lede">
                Selected for optical purity, surface hardness, and digital lifestyle protection.
                Every pair of Marlowe frames can be tailored with any of these four specialized lens types.
              </p>
            </div>
          </Reveal>

          <div className="lens-cards-grid">
            {LENS_TYPES.map((lt, idx) => {
              const isSelected = activeLensType === lt.id;
              return (
                <Reveal key={lt.id} delay={idx * 60}>
                  <div
                    className={`lens-card ${isSelected ? "is-active" : ""}`}
                    onClick={() => setActiveLensType(lt.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lens-card-top">
                      <span className="lens-badge" style={{ borderColor: lt.accentHex, color: lt.accentHex }}>
                        {lt.badge}
                      </span>
                      <span className="lens-price">+£{lt.priceDelta}</span>
                    </div>

                    <h4 className="lens-card-name">{lt.name}</h4>
                    <p className="lens-card-tagline">{lt.tagline}</p>
                    <p className="lens-card-desc micro">{lt.description}</p>

                    <div className="lens-specs-list micro">
                      <div className="lens-spec-row">
                        <span>Coating:</span>
                        <strong>{lt.coating}</strong>
                      </div>
                      <div className="lens-spec-row">
                        <span>Protection:</span>
                        <strong>{lt.uvProtection}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm ${isSelected ? "btn-ink" : "btn-light"}`}
                      style={{ marginTop: "14px", width: "100%" }}
                    >
                      {isSelected ? "✓ Active Selection" : "Inspect Glazing"}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Live Glazing Coating Interactive Simulation Panel */}
          <Reveal delay={120}>
            <div className="lens-sim-panel">
              <div className="lens-sim-header">
                <div>
                  <span className="micro kicker">Interactive Optics Simulator</span>
                  <h4 className="lens-sim-title">
                    {getLensType(activeLensType).name}
                  </h4>
                </div>
                <span className="micro sim-badge">Atelier Physics Sandbox</span>
              </div>

              {activeLensType === "anti-glare" && (
                <div className="sim-content">
                  <div className="sim-copy">
                    <p>
                      <strong>Anti-Glare (AR) Simulation:</strong> Standard uncoated lenses bounce up to 8% of ambient light into your eyes, creating distracting halo rings around headlights and digital monitors. Marlowe’s green-spectrum AR shield cancels reflections through destructive interference.
                    </p>
                    <div className="sim-control-row">
                      <button
                        type="button"
                        className={`btn btn-sm ${arEnabled ? "btn-ink" : "btn-light"}`}
                        onClick={() => setArEnabled(true)}
                      >
                        ✓ Anti-Glare Coating (0.2% Refl.)
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${!arEnabled ? "btn-ink" : "btn-light"}`}
                        onClick={() => setArEnabled(false)}
                      >
                        Uncoated Lens (8% Glare)
                      </button>
                    </div>
                  </div>
                  <div className={`sim-visual ar-visual ${arEnabled ? "ar-active" : "ar-off"}`}>
                    <div className="glare-source">💡 Night Headlight</div>
                    <div className="glare-lens-disc">
                      <div className="glare-reflection" />
                      <span className="glare-readout">
                        {arEnabled ? "Zero Flare · Pure Contrast" : "Blinding Radial Halo Glare"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeLensType === "blue-cut" && (
                <div className="sim-content">
                  <div className="sim-copy">
                    <p>
                      <strong>Blue-Cut Filter Simulation:</strong> Targets high-energy visible (HEV) rays between 415nm and 455nm emitted by OLED screens, eliminating retinal fatigue and circadian rhythm disruptions while preserving true color fidelity.
                    </p>
                    <div className="spectrum-bars">
                      <div className="spectrum-bar">
                        <span className="micro">Standard Lens</span>
                        <div className="bar-fill blue-leak">455nm Blue: 100% Penetration</div>
                      </div>
                      <div className="spectrum-bar">
                        <span className="micro">Blue-Cut Shield</span>
                        <div className="bar-fill blue-blocked">Filtered to Safe Threshold (0.05%)</div>
                      </div>
                    </div>
                  </div>
                  <div className="sim-visual blue-visual">
                    <div className="blue-ray-anim" />
                    <span className="glare-readout">Nanotech Blue-Blocker Active</span>
                  </div>
                </div>
              )}

              {activeLensType === "photochromic" && (
                <div className="sim-content">
                  <div className="sim-copy">
                    <p>
                      <strong>Smart Photochromic Transitions:</strong> Drag the sunlight slider below to watch the molecular matrix darken in response to UV rays, transitioning smoothly between clear indoor glazing and dark polarized sunglasses.
                    </p>
                    <div className="sunlight-slider-wrap">
                      <div className="slider-head">
                        <span className="micro">Ambient Sunlight / UV Exposure</span>
                        <strong>{photochromicSun}% UV Index ({photochromicSun > 60 ? "Direct Sun" : photochromicSun > 20 ? "Overcast" : "Indoors"})</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={photochromicSun}
                        onChange={(e) => setPhotochromicSun(Number(e.target.value))}
                        className="range"
                      />
                      <div className="dial-scale">
                        <span>Indoors (Clear)</span>
                        <span>Diffused Daylight</span>
                        <span>Full Riviera Sun</span>
                      </div>
                    </div>
                  </div>
                  <div className="sim-visual photochromic-visual">
                    <div
                      className="photochromic-disc"
                      style={{
                        backgroundColor: `rgba(35, 30, 24, ${(photochromicSun / 100) * 0.85 + 0.05})`,
                        borderColor: photochromicSun > 50 ? "#a4763f" : "#d1d5db",
                      }}
                    >
                      <span
                        className="photochromic-label"
                        style={{ color: photochromicSun > 50 ? "#fff" : "#191411" }}
                      >
                        {photochromicSun > 70
                          ? "Dark Amber Sunwear (Cat. 3)"
                          : photochromicSun > 25
                            ? "Mid Tint Driving Lens (Cat. 1)"
                            : "Crystal Clear Indoors (Cat. 0)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeLensType === "high-index" && (
                <div className="sim-content">
                  <div className="sim-copy">
                    <p>
                      <strong>1.74 High-Index Compression:</strong> Standard lenses for strong prescriptions are heavy and bulge past frame bevels. Marlowe’s 1.74 ultra-compressed material reduces edge thickness by up to 45% with aspheric geometry.
                    </p>
                    <div className="index-comparison-table micro">
                      <div className="comp-row">
                        <span>Standard 1.50 Index</span>
                        <div className="thick-bar thick-150">6.8 mm edge</div>
                      </div>
                      <div className="comp-row">
                        <span>Mid 1.60 Index</span>
                        <div className="thick-bar thick-160">5.2 mm edge</div>
                      </div>
                      <div className="comp-row is-winner">
                        <span>Marlowe 1.74 Ultra-Thin</span>
                        <div className="thick-bar thick-174">3.6 mm edge (-47%)</div>
                      </div>
                    </div>
                  </div>
                  <div className="sim-visual high-index-visual">
                    <div className="wafer-stack">
                      <div className="wafer wafer-thin">1.74 Aspheric Ultra-Slim</div>
                    </div>
                    <span className="glare-readout">45% Lighter · Featherweight on Bridge</span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
