"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type UserAccount } from "@/lib/auth";

const links = [
  { href: "#atelier", label: "The Atelier", index: "01" },
  { href: "#collections", label: "Collections", index: "02" },
  { href: "#lens", label: "Lens Lab", index: "03" },
  { href: "#fit", label: "The Fit", index: "04" },
  { href: "#visit", label: "Visit", index: "05" },
];

interface SiteNavProps {
  bagCount: number;
  onOpenBag: () => void;
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onOpenStylist: () => void;
  onOpenSettings?: () => void;
}

export default function SiteNav({
  bagCount,
  onOpenBag,
  currentUser,
  onOpenLogin,
  onOpenStylist,
  onOpenSettings,
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const visit = document.getElementById("visit");
      setDark(visit ? visit.getBoundingClientRect().top <= 70 : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`nav ${scrolled ? "is-scrolled" : ""} ${dark ? "is-dark" : ""} ${open ? "is-menu" : ""}`}
      >
        <div className="nav-inner shell">
          <a href="#top" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-name">Marlowe</span>
            <span className="brand-sub">Optical Atelier</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            <a href="#atelier">The Atelier</a>
            
            {/* Collections Dropdown Navigation */}
            <div className="nav-dropdown-wrap">
              <a href="#collections" className="nav-link-dropdown">
                Collections <span className="nav-caret">▾</span>
              </a>
              <div className="nav-dropdown-menu">
                <a href="#collections-international" className="nav-sublink">
                  <span className="sublink-flag">🇬🇧</span>
                  <div className="sublink-text">
                    <span className="sublink-title">International Frames</span>
                    <span className="sublink-subtitle">10 Japanese & British Silhouettes</span>
                  </div>
                </a>
                <a href="#collections-indian" className="nav-sublink">
                  <span className="sublink-flag">🇮🇳</span>
                  <div className="sublink-text">
                    <span className="sublink-title">Indian Frames</span>
                    <span className="sublink-subtitle">6 Architectural Heritage Silhouettes</span>
                  </div>
                </a>
              </div>
            </div>

            <a href="#lens">Lens Lab</a>
            <a href="#fit">The Fit</a>
            <a href="#visit">Visit</a>
          </nav>

          <div className="nav-right">
            {/* AI Stylist shortcut button */}
            <button
              type="button"
              className="nav-stylist-btn"
              onClick={onOpenStylist}
              aria-label="Open AI Optical Stylist"
              title="Consult AI Optical Stylist"
            >
              <span className="stylist-sparkle">✦</span>
              <span className="stylist-nav-label">AI Stylist</span>
            </button>

            {/* Client Login / Profile Portal Button */}
            <button
              type="button"
              className={`user-portal-btn ${currentUser ? "is-logged-in" : ""}`}
              onClick={onOpenLogin}
              aria-label={
                currentUser ? `Account: ${currentUser.name}` : "Client Sign In"
              }
              title={
                currentUser
                  ? `Signed in as ${currentUser.name} (${currentUser.role})`
                  : "Sign in with client credentials"
              }
            >
              {currentUser ? (
                <>
                  <span className="user-avatar-tag">
                    {currentUser.avatarInitials}
                  </span>
                  <span className="user-name-tag">
                    {currentUser.name.split(" ")[0]}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  <span className="user-signin-label">Sign In</span>
                </>
              )}
            </button>

            {/* Settings Drawer Button */}
            {onOpenSettings && (
              <button
                type="button"
                className="nav-settings-btn"
                onClick={onOpenSettings}
                aria-label="Open Atelier Settings"
                title="System Settings & Themes"
              >
                ⚙
              </button>
            )}

            {/* Interactive Fitting Bag Drawer Trigger */}
            <button
              type="button"
              className="bag-btn"
              aria-label={`Fitting bag, ${bagCount} ${bagCount === 1 ? "frame" : "frames"}`}
              onClick={onOpenBag}
            >
              <span className="bag-label">Bag</span>
              <span className="bag-count">{String(bagCount).padStart(2, "0")}</span>
            </button>

            <a href="#visit" className="btn nav-cta">
              Book a fitting
            </a>

            <button
              type="button"
              className={`burger ${open ? "is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`nav-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="nav-overlay-inner">
          <p className="micro nav-overlay-label">Menu — 2026 Archive</p>
          <nav aria-label="Mobile">
            <a href="#atelier" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              The Atelier <span>01</span>
            </a>
            <a href="#collections" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Collections Archive <span>02</span>
            </a>
            <div className="mobile-subnav-list">
              <a href="#collections-international" onClick={() => setOpen(false)} className="mobile-sublink">
                🇬🇧 International Frames (10)
              </a>
              <a href="#collections-indian" onClick={() => setOpen(false)} className="mobile-sublink">
                🇮🇳 Indian Frames (6)
              </a>
            </div>
            <a href="#lens" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Lens Lab <span>03</span>
            </a>
            <a href="#fit" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              The Fit <span>04</span>
            </a>
            <a href="#visit" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Visit <span>05</span>
            </a>
            <button
              type="button"
              className="nav-overlay-mobile-action"
              onClick={() => {
                setOpen(false);
                onOpenLogin();
              }}
            >
              {currentUser
                ? `Account Profile (${currentUser.name})`
                : "Client Sign In (Ganesh, Subham, Sathwik)"}
            </button>
            <button
              type="button"
              className="nav-overlay-mobile-action"
              onClick={() => {
                setOpen(false);
                onOpenStylist();
              }}
            >
              ✦ Consult AI Stylist
            </button>
          </nav>
          <div className="nav-overlay-foot">
            <a href="mailto:hello@marlowe.optical" tabIndex={open ? 0 : -1}>
              hello@marlowe.optical
            </a>
            <p>14 Chiltern Street, Marylebone, London W1U 7PT</p>
          </div>
        </div>
      </div>
    </>
  );
}
