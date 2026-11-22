"use client";

import { useEffect, useState } from "react";
import { soundFx } from "@/lib/sound";
import { type UserAccount } from "@/lib/auth";

export type ThemeMode = "cyber-crimson" | "stealth-obsidian" | "classic-atelier";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onThemeChange: (theme: ThemeMode) => void;
  currentTheme: ThemeMode;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  currentUser,
  onOpenLogin,
  onThemeChange,
  currentTheme,
}: SettingsPanelProps) {
  const [neonGlow, setNeonGlow] = useState(true);
  const [motionIntensity, setMotionIntensity] = useState<"low" | "medium" | "high">("medium");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGlow = localStorage.getItem("marlowe_neon_glow");
      if (storedGlow !== null) setNeonGlow(storedGlow === "true");

      const storedMotion = localStorage.getItem("marlowe_3d_motion");
      if (storedMotion) setMotionIntensity(storedMotion as any);

      setSoundEnabled(soundFx.isEnabled());
    }
  }, []);

  useEffect(() => {
    if (neonGlow) {
      document.documentElement.classList.add("neon-glow-active");
    } else {
      document.documentElement.classList.remove("neon-glow-active");
    }
    localStorage.setItem("marlowe_neon_glow", String(neonGlow));
  }, [neonGlow]);

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", motionIntensity);
    localStorage.setItem("marlowe_3d_motion", motionIntensity);
  }, [motionIntensity]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
    if (next) soundFx.playClick();
  };

  const handleSelectTheme = (mode: ThemeMode) => {
    soundFx.playClick();
    onThemeChange(mode);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="settings-drawer"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="settings-head">
          <div className="settings-head-title">
            <span className="micro kicker">System Preferences</span>
            <h2 className="display">Atelier Settings</h2>
          </div>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label="Close Settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-body">
          {/* 1. Theme Palette Selector */}
          <div className="settings-group">
            <div className="settings-label-row">
              <span className="settings-label">Color Aesthetics & Theme</span>
              <span className="micro text-brass">Real-time Switcher</span>
            </div>
            <div className="theme-options-grid">
              <button
                type="button"
                className={`theme-card ${currentTheme === "cyber-crimson" ? "is-active" : ""}`}
                onClick={() => handleSelectTheme("cyber-crimson")}
              >
                <div className="theme-color-preview cyber-crimson-preview">
                  <span className="preview-accent" />
                </div>
                <strong>Red & Black Cyber-Luxury</strong>
                <span className="micro">Obsidian + High-Contrast Crimson</span>
              </button>

              <button
                type="button"
                className={`theme-card ${currentTheme === "stealth-obsidian" ? "is-active" : ""}`}
                onClick={() => handleSelectTheme("stealth-obsidian")}
              >
                <div className="theme-color-preview stealth-obsidian-preview">
                  <span className="preview-accent" />
                </div>
                <strong>Stealth Obsidian</strong>
                <span className="micro">Monochrome Matte Carbon</span>
              </button>

              <button
                type="button"
                className={`theme-card ${currentTheme === "classic-atelier" ? "is-active" : ""}`}
                onClick={() => handleSelectTheme("classic-atelier")}
              >
                <div className="theme-color-preview classic-atelier-preview">
                  <span className="preview-accent" />
                </div>
                <strong>Heritage London Atelier</strong>
                <span className="micro">Warm British Ivory & Brass</span>
              </button>
            </div>
          </div>

          {/* 2. Neon Glow & Reactive Spotlight */}
          <div className="settings-group">
            <div className="settings-toggle-row">
              <div>
                <span className="settings-label">Crimson Neon Glow & Aura</span>
                <p className="micro text-muted">
                  Enables luminous edge refractions and reactive magnetic spotlight aura
                </p>
              </div>
              <button
                type="button"
                className={`toggle-switch ${neonGlow ? "is-on" : ""}`}
                onClick={() => {
                  soundFx.playClick();
                  setNeonGlow(!neonGlow);
                }}
                aria-pressed={neonGlow}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          {/* 3. 3D Motion & Physics Intensity */}
          <div className="settings-group">
            <div className="settings-label-row">
              <span className="settings-label">3D Motion & Physics Damping</span>
              <span className="micro text-brass">{motionIntensity.toUpperCase()}</span>
            </div>
            <p className="micro text-muted" style={{ marginBottom: "10px" }}>
              Controls damping speed, rotation inertia, and exploded-view separation velocity
            </p>
            <div className="motion-chips-row">
              {(["low", "medium", "high"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`motion-chip ${motionIntensity === m ? "is-active" : ""}`}
                  onClick={() => {
                    soundFx.playClick();
                    setMotionIntensity(m);
                  }}
                >
                  {m === "low" ? "Low / Gentle" : m === "medium" ? "Medium / Balanced" : "High / Hyper-Responsive"}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Kinetic Sound FX Synthesizer */}
          <div className="settings-group">
            <div className="settings-toggle-row">
              <div>
                <span className="settings-label">Kinetic UI Sound FX</span>
                <p className="micro text-muted">
                  Tactile synthesized micro-clicks on hover, laser engraving, and 3D explode
                </p>
              </div>
              <button
                type="button"
                className={`toggle-switch ${soundEnabled ? "is-on" : ""}`}
                onClick={toggleSound}
                aria-pressed={soundEnabled}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          {/* 5. Client Profile Shortcut */}
          <div className="settings-group settings-patron-group">
            <span className="micro kicker">Client Credentials</span>
            {currentUser ? (
              <div className="settings-user-box">
                <div className="profile-avatar">{currentUser.avatarInitials}</div>
                <div className="user-box-text">
                  <strong>{currentUser.name}</strong>
                  <span className="micro">{currentUser.role}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                >
                  Profile Details
                </button>
              </div>
            ) : (
              <div className="settings-guest-box">
                <p className="micro text-muted">Currently browsing in Guest Patron Mode.</p>
                <button
                  type="button"
                  className="btn btn-sm btn-ink"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
