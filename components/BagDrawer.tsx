"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FrameThumb from "./FrameThumb";
import {
  type Frame,
  type TintOption,
  getColour,
  getFrame,
  getTint,
  getLensType,
  type LensTypeId,
} from "@/lib/frames";
import { type UserAccount } from "@/lib/auth";

export interface BagItem {
  id: string;
  frameId: string;
  colourId: string;
  tintId: string;
  lensTypeId?: string;
  quantity: number;
}

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
}

export default function BagDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
  currentUser,
  onOpenLogin,
}: BagDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOrderComplete(null);
      setIsCheckingOut(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Apply automatic user discount if logged in
  useEffect(() => {
    if (currentUser) {
      setPromoDiscount(currentUser.bagDiscountPercent);
      setPromoMessage(`${currentUser.name}'s VIP Privilege applied (${currentUser.bagDiscountPercent}% off)`);
    } else if (promoCode.trim().toUpperCase() === "VIPATELIER" || promoCode.trim().toUpperCase() === "GANESH") {
      setPromoDiscount(15);
      setPromoMessage("VIP Patron privilege applied (15% off)");
    }
  }, [currentUser, promoCode]);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => {
    const frame = getFrame(item.frameId as any);
    const lens = getLensType(item.lensTypeId as LensTypeId);
    const itemUnitPrice = frame.price + (lens ? lens.priceDelta : 0);
    return sum + itemUnitPrice * item.quantity;
  }, 0);

  const discountAmount = promoDiscount ? (rawSubtotal * promoDiscount) / 100 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const applyCodeString = (code: string) => {
    const clean = code.trim().toUpperCase();
    setPromoCode(clean);
    if (
      clean === "VIPATELIER" ||
      clean === "GANESH" ||
      clean === "SUBHAM" ||
      clean === "SATHWIK"
    ) {
      setPromoDiscount(15);
      setPromoMessage("Atelier Patron code valid: 15% discount applied");
    } else if (clean === "INDIA10" || clean === "ATELIER10") {
      setPromoDiscount(10);
      setPromoMessage("10% Indian Heritage seasonal concession applied");
    } else if (clean === "BLUELIGHT") {
      setPromoDiscount(12);
      setPromoMessage("BlueLight Shield patron concession (12% off) applied");
    } else if (clean === "MARLOWE10") {
      setPromoDiscount(10);
      setPromoMessage("10% Seasonal concession applied");
    } else {
      setPromoDiscount(null);
      setPromoMessage("Invalid code. Click one of the suggested tags below.");
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyCodeString(promoCode);
  };

  const handleQuickCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const orderNum = "MAR-" + Math.floor(100000 + Math.random() * 900000);
      setIsCheckingOut(false);
      setOrderComplete(orderNum);
      onClearBag();
    }, 1200);
  };

  return (
    <div className="bag-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bag-drawer"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="bag-drawer-head">
          <div>
            <span className="micro kicker">Fitting Bag</span>
            <h2 className="display bag-drawer-title">
              Your Selection ({items.reduce((acc, it) => acc + it.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            className="bag-drawer-close"
            onClick={onClose}
            aria-label="Close bag"
          >
            ✕
          </button>
        </div>

        {orderComplete ? (
          <div className="bag-complete">
            <div className="complete-badge">✓</div>
            <h3 className="display complete-title">Bespoke Order Glazed</h3>
            <p className="micro">Reference: {orderComplete}</p>
            <p className="complete-desc">
              Thank you for trusting Marlowe Optical Atelier. Your custom frames
              are now scheduled for precision optical surface grinding and
              hand-edge polishing in our laboratory.
            </p>
            {currentUser && (
              <div className="complete-user-box">
                <span className="micro">Assigned Patron</span>
                <strong>{currentUser.name}</strong>
                <p className="micro">
                  Glazing to recorded RX: {currentUser.prescription.sph} SPH · PD {currentUser.prescription.pd}
                </p>
              </div>
            )}
            <p className="complete-shipping micro">
              Insured Express Courier delivery scheduled within 7–10 days.
            </p>
            <button
              type="button"
              className="btn btn-ink btn-block"
              onClick={onClose}
            >
              Return to Studio
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bag-empty">
            <p className="bag-empty-text">Your fitting bag is presently empty.</p>
            <p className="micro bag-empty-sub">
              Select any piece from our International or Indian archive, choose your finish
              and lens formulation, and add it for inspection.
            </p>
            <button
              type="button"
              className="btn btn-ink"
              onClick={onClose}
            >
              Explore the Collection
            </button>
          </div>
        ) : (
          <div className="bag-content-scroll">
            <div className="bag-items-list">
              {items.map((item) => {
                const frame = getFrame(item.frameId as any);
                const colour = getColour(frame, item.colourId);
                const tint = getTint(item.tintId as any);
                const lens = getLensType(item.lensTypeId as LensTypeId);
                const itemUnitPrice = frame.price + (lens ? lens.priceDelta : 0);

                return (
                  <div key={item.id} className="bag-item-card">
                    <div className="bag-item-thumb">
                      <FrameThumb
                        frame={frame}
                        strokeColor={
                          getColour(frame, item.colourId)?.hex || "#ff2a4d"
                        }
                      />
                    </div>
                    <div className="bag-item-info">
                      <div className="bag-item-head">
                        <div>
                          <h4 className="bag-item-name">{frame.name}</h4>
                          <span className="micro" style={{ color: frame.origin === "indian" ? "var(--brass)" : "var(--ink-3)" }}>
                            {frame.origin === "indian" ? "🇮🇳 Indian Heritage" : "🇬🇧 International"}
                          </span>
                        </div>
                        <span className="bag-item-price">
                          £{itemUnitPrice * item.quantity}
                        </span>
                      </div>
                      <p className="micro bag-item-variant">
                        {colour.name} · {tint.name} Tint
                      </p>
                      <p className="micro bag-item-lens" style={{ color: lens.accentHex, fontWeight: 500 }}>
                        ✦ {lens.badge} (+£{lens.priceDelta})
                      </p>
                      <p className="micro bag-item-material">
                        {frame.material === "acetate"
                          ? "Hand-polished acetate"
                          : "Japanese titanium wire"}{" "}
                        · {frame.specs.lens}
                      </p>

                      <div className="bag-item-controls">
                        <div className="quantity-group">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="item-remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complimentary luxury accessories box */}
            <div className="bag-perks-box">
              <span className="micro kicker">Included With Every Frame</span>
              <ul className="bag-perks-list">
                <li>✦ Full-grain British calfskin hard case</li>
                <li>✦ Microfibre lint-free optical cleaning cloth</li>
                <li>✦ Precision jeweller’s hinge adjustment driver</li>
                <li>✦ Complimentary lifetime ultrasonic cleaning & alignment</li>
              </ul>
            </div>

            {/* Voucher input with clickable chip suggestions */}
            <div className="promo-container">
              <form onSubmit={handleApplyPromo} className="promo-box">
                <input
                  type="text"
                  placeholder="Patron code (e.g. INDIA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="promo-btn">
                  Apply
                </button>
              </form>

              <div className="promo-chips-row micro">
                <span className="micro">Quick Codes:</span>
                <button
                  type="button"
                  className="promo-chip"
                  onClick={() => applyCodeString("INDIA10")}
                >
                  INDIA10 (10% off)
                </button>
                <button
                  type="button"
                  className="promo-chip"
                  onClick={() => applyCodeString("VIPATELIER")}
                >
                  VIPATELIER (15% off)
                </button>
                <button
                  type="button"
                  className="promo-chip"
                  onClick={() => applyCodeString("BLUELIGHT")}
                >
                  BLUELIGHT (12% off)
                </button>
              </div>

              {promoMessage && (
                <p className="micro promo-msg text-brass">{promoMessage}</p>
              )}
            </div>

            {!currentUser && (
              <div className="patron-login-prompt">
                <span className="micro">Have an account?</span>
                <button
                  type="button"
                  className="patron-link"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                >
                  Sign in for Ganesh, Subham, or Sathwik VIP privileges →
                </button>
              </div>
            )}
          </div>
        )}

        {items.length > 0 && !orderComplete && (
          <div className="bag-drawer-footer">
            <div className="bag-summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>£{rawSubtotal.toFixed(2)}</span>
              </div>
              {promoDiscount && (
                <div className="summary-row text-brass">
                  <span>Patron Allowance ({promoDiscount}%)</span>
                  <span>−£{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Express Insured Courier</span>
                <span className="text-free">Complimentary</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-val">£{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bag-checkout-actions">
              {/* Dedicated full checkout page link */}
              <Link
                href="/checkout"
                className="btn btn-ink btn-block bag-checkout-btn"
                onClick={onClose}
              >
                Proceed to Checkout Page → £{finalTotal.toFixed(2)}
              </Link>
              <button
                type="button"
                disabled={isCheckingOut}
                className="btn btn-light btn-block"
                onClick={handleQuickCheckout}
                style={{ marginTop: "6px" }}
              >
                {isCheckingOut ? "Reserving Glazing..." : "Quick 1-Click Reserve"}
              </button>
            </div>
            <p className="micro bag-foot-note">
              Includes selected optical lens formulation · Complimentary global delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
