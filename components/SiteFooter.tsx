"use client";

import { useState, type FormEvent } from "react";

interface SiteFooterProps {
  onOpenBooking?: () => void;
}

export default function SiteFooter({ onOpenBooking }: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setJoined(true);
    setEmail("");
  };

  return (
    <footer id="visit" className="footer">
      <div className="shell">
        <div className="foot-cta foot-cta-orange-banner">
          <div>
            <div className="section-kicker foot-kicker foot-kicker-orange">
              <span>05</span>
              <span>Visit & Private Fitting</span>
            </div>
            <h2 className="display foot-title">
              Book a fitting.
              <br />
              <em className="orange-glow-text">Bring your curiosity.</em>
            </h2>
          </div>
          <button
            type="button"
            className="btn foot-cta-btn foot-cta-orange"
            onClick={() => {
              if (onOpenBooking) onOpenBooking();
            }}
            aria-label="Open private fitting reservation window"
          >
            <span className="btn-orange-beacon" />
            <span>Book a fitting</span>
            <span aria-hidden="true" className="btn-arrow-icon">↗</span>
          </button>
        </div>

        <div className="foot-grid">
          <div>
            <h4>The atelier</h4>
            <p>
              14 Chiltern Street
              <br />
              Marylebone
              <br />
              London W1U 7PT
            </p>
          </div>
          <div>
            <h4>Opening hours</h4>
            <p>
              Tuesday – Saturday
              <br />
              10.00 – 18.00
              <br />
              Sunday by appointment
            </p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>
              <a href="mailto:hello@marlowe.optical">
                hello@marlowe.optical
              </a>
              <br />
              <a href="tel:+442079460018">+44 20 7946 0018</a>
              <br />
              <a href="#atelier">The collection</a>
            </p>
          </div>
          <div>
            <h4>The quarterly</h4>
            <p>Four letters a year on frames, eyes and craft.</p>
            {joined ? (
              <p className="foot-joined">Thank you — you are on the list.</p>
            ) : (
              <form className="newsletter" onSubmit={onSubmit}>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button type="submit">Join</button>
              </form>
            )}
          </div>
        </div>

        <div className="wordmark" aria-hidden="true">
          Marlowe<span>.</span>
        </div>

        <div className="fine">
          <p>© 2026 Marlowe Optical Atelier · London & New Delhi</p>
          <p>
            <a href="#top">Back to top ↑</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
