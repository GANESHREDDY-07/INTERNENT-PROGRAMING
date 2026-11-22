"use client";

import { useEffect, useRef, useState } from "react";
import { type Frame, type FrameId, getFrame, pointsToSvgPath, lensOutline } from "@/lib/frames";
import { soundFx } from "@/lib/sound";

interface WebcamTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  frame: Frame;
  onSelectFrame: (id: FrameId) => void;
}

export default function WebcamTryOn({
  isOpen,
  onClose,
  frame,
  onSelectFrame,
}: WebcamTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // AR adjustments
  const [verticalOffset, setVerticalOffset] = useState(0); // in px
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [crimsonGlow, setCrimsonGlow] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      return;
    }
  }, [isOpen]);

  const startCamera = async () => {
    soundFx.playClick();
    setPermissionError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Webcam access notice:", err);
      setPermissionError(
        "Camera access was not granted or no webcam was detected. You can use the Virtual Studio Mirror simulation below."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleCaptureSnapshot = () => {
    soundFx.playLaserEngrave();
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video mirror
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Export photo data URL
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedPhoto(dataUrl);
  };

  if (!isOpen) return null;

  const leftOutline = pointsToSvgPath(lensOutline(frame.shape, -1, 120, 0));
  const rightOutline = pointsToSvgPath(lensOutline(frame.shape, 1, 120, 0));
  const outerLeft = pointsToSvgPath(lensOutline(frame.shape, -1, 120, frame.shape.rimThickness));
  const outerRight = pointsToSvgPath(lensOutline(frame.shape, 1, 120, frame.shape.rimThickness));

  return (
    <div className="ar-tryon-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="ar-tryon-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="ar-modal-head">
          <div>
            <span className="micro kicker">✦ AR Optical Mirror v2.6</span>
            <h2 className="display">Virtual Real-Time Try-On</h2>
          </div>
          <button
            type="button"
            className="ar-modal-close"
            onClick={onClose}
            aria-label="Close AR Mirror"
          >
            ✕
          </button>
        </div>

        <div className="ar-modal-body">
          {/* Main Camera / Mirror Feed */}
          <div className="ar-viewport-wrap">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`ar-video-feed ${cameraActive ? "is-live" : "is-hidden"}`}
            />

            {/* Virtual Simulation Face if camera is off or denied */}
            {!cameraActive && (
              <div className="ar-simulated-face">
                <div className="sim-face-oval">
                  <div className="sim-eye sim-eye-left" />
                  <div className="sim-eye sim-eye-right" />
                  <div className="sim-nose" />
                </div>
                <div className="ar-camera-cta-overlay">
                  <span className="micro kicker text-brass">Real-Time Head Tracking</span>
                  <h3>Activate Webcam Mirror</h3>
                  <p className="micro text-muted">
                    Overlays {frame.name} directly onto your eyes with live head-tilt alignment and crimson lens reflections.
                  </p>
                  <button
                    type="button"
                    className="btn btn-ink ar-launch-btn"
                    onClick={startCamera}
                  >
                    📷 Enable Webcam Mirror
                  </button>
                  {permissionError && (
                    <p className="micro text-crimson" style={{ marginTop: "12px", maxWidth: "420px" }}>
                      {permissionError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Futuristic Cyber-HUD Alignment Overlay */}
            <div className="ar-hud-overlay">
              <div className="hud-corner hud-tl" />
              <div className="hud-corner hud-tr" />
              <div className="hud-corner hud-bl" />
              <div className="hud-corner hud-br" />

              <div className="hud-telemetry">
                <span className="micro telemetry-tag">✦ LIVE AR FACIAL TRACKER</span>
                <span className="micro telemetry-tag">FRAME: {frame.name.toUpperCase()}</span>
                <span className="micro telemetry-tag">PD CALIB: 64 mm</span>
              </div>

              {/* The Virtual Eyewear Augmented Overlay */}
              <div
                className={`ar-glasses-rig ${crimsonGlow ? "has-crimson-reflection" : ""}`}
                style={{
                  transform: `translate(-50%, calc(-50% + ${verticalOffset}px)) scale(${scaleFactor})`,
                }}
              >
                <svg
                  viewBox="-6 -4 12 8"
                  className="ar-glasses-svg"
                  style={{
                    filter: crimsonGlow
                      ? "drop-shadow(0 0 14px rgba(230, 0, 38, 0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))"
                      : "drop-shadow(0 4px 12px rgba(0,0,0,0.8))",
                  }}
                >
                  <defs>
                    <linearGradient id="arCrimsonRefl" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                      <stop offset="35%" stopColor="#ff1744" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#800010" stopOpacity="0.65" />
                    </linearGradient>
                  </defs>

                  {/* Left & Right Rims */}
                  <path
                    d={`${outerLeft} ${leftOutline}`}
                    fillRule="evenodd"
                    fill={frame.colours[0]?.hex || "#111"}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="0.04"
                    transform={`translate(${-frame.bridge / 2 - frame.shape.width / 2}, 0)`}
                  />
                  <path
                    d={`${outerRight} ${rightOutline}`}
                    fillRule="evenodd"
                    fill={frame.colours[0]?.hex || "#111"}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="0.04"
                    transform={`translate(${frame.bridge / 2 + frame.shape.width / 2}, 0)`}
                  />

                  {/* Left & Right Glazed Lenses with Crimson Sheen */}
                  <path
                    d={leftOutline}
                    fill={crimsonGlow ? "url(#arCrimsonRefl)" : "rgba(255,255,255,0.2)"}
                    stroke="#ff1e42"
                    strokeWidth="0.02"
                    transform={`translate(${-frame.bridge / 2 - frame.shape.width / 2}, 0)`}
                  />
                  <path
                    d={rightOutline}
                    fill={crimsonGlow ? "url(#arCrimsonRefl)" : "rgba(255,255,255,0.2)"}
                    stroke="#ff1e42"
                    strokeWidth="0.02"
                    transform={`translate(${frame.bridge / 2 + frame.shape.width / 2}, 0)`}
                  />

                  {/* Center Keyhole Bridge */}
                  <rect
                    x={-frame.bridge / 2}
                    y={-0.1}
                    width={frame.bridge}
                    height={0.22}
                    rx="0.08"
                    fill={frame.colours[0]?.hex || "#111"}
                  />
                </svg>
              </div>

              {cameraActive && (
                <div className="ar-snap-action">
                  <button
                    type="button"
                    className="btn btn-ink btn-sm"
                    onClick={handleCaptureSnapshot}
                  >
                    📸 Capture Portrait
                  </button>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* Controls & Quick Frame Switcher Sidebar */}
          <div className="ar-controls-panel">
            <div className="ar-panel-head">
              <span className="micro kicker">Interactive Calibration</span>
              <h4>{frame.name} AR Mirror</h4>
              <p className="micro text-muted">
                {frame.origin === "indian" ? "🇮🇳 Indian Heritage Series" : "🇬🇧 International Series"} · {frame.tagline}
              </p>
            </div>

            {/* Fine Calibration Sliders */}
            <div className="ar-adjustments-group">
              <div className="ar-slider-row">
                <span className="micro">Vertical Alignment</span>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={verticalOffset}
                  onChange={(e) => setVerticalOffset(Number(e.target.value))}
                  className="range"
                />
              </div>

              <div className="ar-slider-row">
                <span className="micro">Scale & Bridge Fit ({(scaleFactor * 100).toFixed(0)}%)</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.45"
                  step="0.02"
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(Number(e.target.value))}
                  className="range"
                />
              </div>

              <div className="ar-toggle-row">
                <span className="micro">Crimson Lens Reflection</span>
                <button
                  type="button"
                  className={`toggle-switch ${crimsonGlow ? "is-on" : ""}`}
                  onClick={() => setCrimsonGlow(!crimsonGlow)}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>

            {/* Quick Frames Carousel inside AR */}
            <div className="ar-quick-frames">
              <span className="micro kicker">Select Different Silhouette</span>
              <div className="ar-frames-list">
                {[
                  "rectangle",
                  "circle",
                  "oval",
                  "round",
                  "retro",
                  "aviator",
                  "aurelia",
                  "meridian",
                  "atlas",
                  "solstice",
                ].map((fid) => {
                  const f = getFrame(fid as FrameId);
                  const isCur = f.id === frame.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`ar-frame-chip ${isCur ? "is-active" : ""}`}
                      onClick={() => onSelectFrame(f.id)}
                    >
                      <span>{f.origin === "indian" ? "🇮🇳" : "🇬🇧"} {f.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {capturedPhoto && (
              <div className="ar-snapshot-preview">
                <span className="micro kicker">Captured Atelier Portrait</span>
                <img src={capturedPhoto} alt="AR Snapshot" className="ar-photo-thumb" />
                <a
                  href={capturedPhoto}
                  download={`marlowe-${frame.id}-tryon.png`}
                  className="btn btn-ink btn-sm btn-block"
                  style={{ marginTop: "6px" }}
                >
                  Download Portrait 💾
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
