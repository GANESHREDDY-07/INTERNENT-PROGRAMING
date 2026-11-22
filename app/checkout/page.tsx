"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FrameThumb from "@/components/FrameThumb";
import {
  FRAMES,
  LENS_TYPES,
  type Frame,
  type FrameId,
  type LensTypeId,
  getColour,
  getFrame,
  getLensType,
  getTint,
} from "@/lib/frames";
import { getCurrentUser, type UserAccount } from "@/lib/auth";

interface CheckoutItem {
  id: string;
  frameId: FrameId;
  colourId: string;
  tintId: string;
  lensTypeId: LensTypeId;
  quantity: number;
}

export default function CheckoutPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Cart items state
  const [items, setItems] = useState<CheckoutItem[]>([
    {
      id: "item-1",
      frameId: "rectangle", // Arya Rectangle (Indian Collection)
      colourId: "madras_tortoise",
      tintId: "clear",
      lensTypeId: "blue-cut",
      quantity: 1,
    },
    {
      id: "item-2",
      frameId: "aurelia", // Aurelia (International Collection)
      colourId: "brass",
      tintId: "sepia",
      lensTypeId: "anti-glare",
      quantity: 1,
    },
  ]);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  // Optical Prescription Fields
  const [rxType, setRxType] = useState<"distance" | "reading" | "plano">("distance");
  const [sphOD, setSphOD] = useState("−2.50");
  const [cylOD, setCylOD] = useState("−0.75");
  const [axisOD, setAxisOD] = useState("180°");
  const [pd, setPd] = useState("64 mm");
  const [rxNotes, setRxNotes] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    date: string;
    deliveryDate: string;
    total: number;
  } | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFullName(user.name);
      setEmail(`${user.username}@atelier-patron.com`);
      setSphOD(user.prescription.sph);
      setCylOD(user.prescription.cyl);
      setAxisOD(user.prescription.axis);
      setPd(user.prescription.pd);
      setRxNotes(user.bespokeNotes);
      setDiscountPercent(user.bagDiscountPercent);
      setPromoMessage(`${user.name}'s VIP Patron Privilege (${user.bagDiscountPercent}% discount) active`);
    }
  }, []);

  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    setPromoCode(clean);
    if (clean === "INDIA10") {
      setDiscountPercent(10);
      setPromoMessage("10% Indian Heritage seasonal concession applied");
    } else if (clean === "VIPATELIER" || clean === "GANESH") {
      setDiscountPercent(15);
      setPromoMessage("VIP Patron privilege: 15% discount applied");
    } else if (clean === "BLUELIGHT") {
      setDiscountPercent(12);
      setPromoMessage("BlueLight Shield patron concession (12% off) applied");
    } else {
      setDiscountPercent(0);
      setPromoMessage("Unrecognized voucher code. Try INDIA10 or VIPATELIER.");
    }
  };

  const rawSubtotal = items.reduce((sum, item) => {
    const frame = getFrame(item.frameId);
    const lens = getLensType(item.lensTypeId);
    return sum + (frame.price + lens.priceDelta) * item.quantity;
  }, 0);

  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !address || !city || !postalCode) {
      alert("Please complete the required shipping address fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const randomRef = "MAR-" + (country === "India" ? "IND-" : "INT-") + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const delivery = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      setIsSubmitting(false);
      setConfirmedOrder({
        orderId: randomRef,
        date: today,
        deliveryDate: delivery,
        total: finalTotal,
      });
    }, 1500);
  };

  return (
    <div className="checkout-page-root">
      {/* Top Header */}
      <header className="checkout-nav">
        <div className="shell checkout-nav-inner">
          <Link href="/" className="brand">
            <span className="brand-name">Marlowe</span>
            <span className="brand-sub">Optical Atelier</span>
          </Link>
          <div className="checkout-nav-badge">
            <span className="micro">✦ 256-Bit Encrypted Bespoke Checkout</span>
          </div>
        </div>
      </header>

      <main className="shell checkout-main">
        {confirmedOrder ? (
          /* Order Confirmation Screen */
          <div className="order-confirmed-card">
            <div className="confirmed-badge">✓</div>
            <span className="micro kicker">Official Atelier Glazing Certificate</span>
            <h1 className="display confirmed-title">Order Confirmed & Commissioned</h1>
            <p className="confirmed-subtitle">
              Order Reference: <strong>{confirmedOrder.orderId}</strong>
            </p>

            <div className="confirmed-details-grid">
              <div className="confirmed-box">
                <span className="micro kicker">Client & Shipping To</span>
                <h4>{fullName}</h4>
                <p className="micro">{address}</p>
                <p className="micro">{city}, {stateProv} {postalCode}</p>
                <p className="micro">{country} · {phone || "Verified Contact"}</p>
              </div>

              <div className="confirmed-box">
                <span className="micro kicker">Optical Prescription Recorded</span>
                <h4>{rxType === "plano" ? "Plano (Non-Prescription)" : `SPH: ${sphOD} · CYL: ${cylOD}`}</h4>
                <p className="micro">Axis: {axisOD} · Pupillary Distance: {pd}</p>
                <p className="micro">Notes: {rxNotes || "Glazed to verified optical standards"}</p>
              </div>

              <div className="confirmed-box">
                <span className="micro kicker">Timeline & Delivery</span>
                <h4>Scheduled: {confirmedOrder.deliveryDate}</h4>
                <p className="micro">Precision Diamond Edging: 3 Business Days</p>
                <p className="micro">Insured Hand Delivery: Complimentarily Dispatched</p>
              </div>

              <div className="confirmed-box">
                <span className="micro kicker">Settlement Summary</span>
                <h4>Total Paid: £{confirmedOrder.total.toFixed(2)}</h4>
                <p className="micro">
                  Method: {paymentMethod === "upi" ? "UPI Instant Payment" : paymentMethod === "card" ? "Credit Card" : "Cash on Concierge Delivery"}
                </p>
                <span className="text-free micro">✓ Certificate of Authenticity Included</span>
              </div>
            </div>

            <div className="confirmed-items-summary">
              <span className="micro kicker">Commissioned Pieces</span>
              {items.map((it) => {
                const f = getFrame(it.frameId);
                const col = getColour(f, it.colourId);
                const lt = getLensType(it.lensTypeId);
                return (
                  <div key={it.id} className="confirmed-item-row">
                    <span>
                      {f.name} ({f.origin === "indian" ? "🇮🇳 Indian" : "🇬🇧 Intl"}) · {col.name} · {lt.name} (x{it.quantity})
                    </span>
                    <strong>£{((f.price + lt.priceDelta) * it.quantity).toFixed(2)}</strong>
                  </div>
                );
              })}
            </div>

            <div className="confirmed-actions">
              <button
                type="button"
                className="btn btn-ink"
                onClick={() => window.print()}
              >
                Print Official Atelier Invoice 🖨
              </button>
              <Link href="/" className="btn btn-light">
                Return to Atelier Homepage →
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form & Order Summary */
          <div className="checkout-grid">
            {/* Form Column */}
            <form onSubmit={handlePlaceOrder} className="checkout-form-column">
              {/* 1. Client & Shipping Address */}
              <section className="checkout-section">
                <div className="section-head-sm">
                  <span className="micro kicker">Step 01</span>
                  <h3 className="display">Shipping & Patron Details</h3>
                </div>

                {currentUser && (
                  <div className="autofill-banner">
                    <span className="micro">
                      ✓ Pre-filled with Patron Profile details for <strong>{currentUser.name}</strong> ({currentUser.role})
                    </span>
                  </div>
                )}

                <div className="form-row form-grid-2">
                  <div className="form-field">
                    <label htmlFor="fn">Full Name *</label>
                    <input
                      id="fn"
                      type="text"
                      required
                      placeholder="e.g. Ganesh Reddy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="em">Email Address *</label>
                    <input
                      id="em"
                      type="email"
                      required
                      placeholder="patron@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row form-grid-2">
                  <div className="form-field">
                    <label htmlFor="ph">Contact / WhatsApp *</label>
                    <input
                      id="ph"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ctry">Destination Country *</label>
                    <select
                      id="ctry"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="United Arab Emirates">🇦🇪 UAE / Dubai</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="Japan">🇯🇵 Japan</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="addr">Street Address / Estate *</label>
                  <input
                    id="addr"
                    type="text"
                    required
                    placeholder="Apartment, Studio, Street name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-row form-grid-3">
                  <div className="form-field">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      required
                      placeholder="e.g. Hyderabad / London"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="sp">State / Province *</label>
                    <input
                      id="sp"
                      type="text"
                      required
                      placeholder="e.g. Telangana / Greater London"
                      value={stateProv}
                      onChange={(e) => setStateProv(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pin">PIN / Postal Code *</label>
                    <input
                      id="pin"
                      type="text"
                      required
                      placeholder="e.g. 500081 / W1U 7PT"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* 2. Optical Glazing & Prescription */}
              <section className="checkout-section">
                <div className="section-head-sm">
                  <span className="micro kicker">Step 02</span>
                  <h3 className="display">Optical Prescription & Glazing</h3>
                </div>

                <div className="rx-type-selector">
                  <button
                    type="button"
                    className={`rx-type-btn ${rxType === "distance" ? "is-active" : ""}`}
                    onClick={() => setRxType("distance")}
                  >
                    Distance Vision
                  </button>
                  <button
                    type="button"
                    className={`rx-type-btn ${rxType === "reading" ? "is-active" : ""}`}
                    onClick={() => setRxType("reading")}
                  >
                    Near / Reading
                  </button>
                  <button
                    type="button"
                    className={`rx-type-btn ${rxType === "plano" ? "is-active" : ""}`}
                    onClick={() => setRxType("plano")}
                  >
                    Plano (Fashion / Non-Rx)
                  </button>
                </div>

                {rxType !== "plano" && (
                  <div className="form-row form-grid-4">
                    <div className="form-field">
                      <label htmlFor="sph">Sphere (SPH)</label>
                      <input
                        id="sph"
                        type="text"
                        value={sphOD}
                        onChange={(e) => setSphOD(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="cyl">Cylinder (CYL)</label>
                      <input
                        id="cyl"
                        type="text"
                        value={cylOD}
                        onChange={(e) => setCylOD(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="ax">Axis</label>
                      <input
                        id="ax"
                        type="text"
                        value={axisOD}
                        onChange={(e) => setAxisOD(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="pdd">Pupillary Dist (PD)</label>
                      <input
                        id="pdd"
                        type="text"
                        value={pd}
                        onChange={(e) => setPd(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label htmlFor="rxn">Special Glazing Directives / Optician Notes</label>
                  <input
                    id="rxn"
                    type="text"
                    placeholder="e.g. SEP-1 driving tint, ultra-thin 1.74 edge bevel polish..."
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                  />
                </div>
              </section>

              {/* 3. Payment Method */}
              <section className="checkout-section">
                <div className="section-head-sm">
                  <span className="micro kicker">Step 03</span>
                  <h3 className="display">Payment Method</h3>
                </div>

                <div className="payment-options-grid">
                  <button
                    type="button"
                    className={`payment-method-card ${paymentMethod === "upi" ? "is-active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <span className="payment-method-icon">⚡</span>
                    <strong>UPI / NetBanking</strong>
                    <span className="micro">GPay, PhonePe, Paytm, QR</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-method-card ${paymentMethod === "card" ? "is-active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <span className="payment-method-icon">💳</span>
                    <strong>Credit / Debit Card</strong>
                    <span className="micro">Visa, MasterCard, Amex</span>
                  </button>

                  <button
                    type="button"
                    className={`payment-method-card ${paymentMethod === "cod" ? "is-active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <span className="payment-method-icon">📦</span>
                    <strong>Atelier Concierge</strong>
                    <span className="micro">Payment on Delivery</span>
                  </button>
                </div>

                {paymentMethod === "upi" && (
                  <div className="payment-details-box">
                    <label htmlFor="upi">Enter Virtual Payment Address (UPI ID)</label>
                    <input
                      id="upi"
                      type="text"
                      placeholder="e.g. patron@okhdfcbank or 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="micro text-brass" style={{ marginTop: "6px" }}>
                      Instant UPI payment authorization prompt will be dispatched upon commission.
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="payment-details-box">
                    <div className="form-field">
                      <label htmlFor="cn">Card Number</label>
                      <input
                        id="cn"
                        type="text"
                        placeholder="4532 •••• •••• 8912"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="form-row form-grid-2">
                      <div className="form-field">
                        <label htmlFor="ex">MM / YY</label>
                        <input
                          id="ex"
                          type="text"
                          placeholder="08/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="cv">CVV</label>
                        <input
                          id="cv"
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="payment-details-box">
                    <p className="micro">
                      Our atelier concierge will hand-deliver your bespoke spectacle case and inspect fit before collecting payment via Card or UPI at your doorstep.
                    </p>
                  </div>
                )}
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-ink btn-block checkout-submit-btn"
              >
                {isSubmitting
                  ? "Transmitting Glazing Blueprint to Atelier..."
                  : `Authorize Bespoke Commission · £${finalTotal.toFixed(2)}`}
              </button>
            </form>

            {/* Order Summary Column */}
            <aside className="checkout-summary-column">
              <div className="summary-sticky-card">
                <div className="summary-card-head">
                  <span className="micro kicker">Commission Summary</span>
                  <h3 className="display">Your Pieces ({items.length})</h3>
                </div>

                <div className="checkout-items-list">
                  {items.map((it) => {
                    const f = getFrame(it.frameId);
                    const col = getColour(f, it.colourId);
                    const tint = getTint(it.tintId as any);
                    const lt = getLensType(it.lensTypeId);
                    const unitPrice = f.price + lt.priceDelta;

                    return (
                      <div key={it.id} className="checkout-item-card">
                        <div className="checkout-item-thumb">
                          <FrameThumb frame={f} />
                        </div>
                        <div className="checkout-item-details">
                          <div className="checkout-item-title-row">
                            <h4>{f.name}</h4>
                            <span>£{unitPrice * it.quantity}</span>
                          </div>
                          <span className="micro" style={{ color: f.origin === "indian" ? "var(--brass)" : "var(--ink-3)" }}>
                            {f.origin === "indian" ? "🇮🇳 Indian Heritage" : "🇬🇧 International"}
                          </span>
                          <p className="micro text-muted">
                            {col.name} · {tint.name} Tint
                          </p>
                          <p className="micro" style={{ color: lt.accentHex, fontWeight: 500 }}>
                            ✦ {lt.badge} (+£{lt.priceDelta})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Input */}
                <div className="checkout-promo-box">
                  <div className="promo-input-row">
                    <input
                      type="text"
                      placeholder="Voucher code (e.g. INDIA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-ink btn-sm"
                      onClick={() => handleApplyPromo(promoCode)}
                    >
                      Apply
                    </button>
                  </div>
                  <div className="checkout-quick-codes micro">
                    <button type="button" onClick={() => handleApplyPromo("INDIA10")}>
                      INDIA10 (10%)
                    </button>
                    <button type="button" onClick={() => handleApplyPromo("VIPATELIER")}>
                      VIPATELIER (15%)
                    </button>
                  </div>
                  {promoMessage && (
                    <p className="micro text-brass" style={{ marginTop: "6px" }}>
                      {promoMessage}
                    </p>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="checkout-financial-rows">
                  <div className="c-row">
                    <span>Subtotal</span>
                    <span>£{rawSubtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="c-row text-brass">
                      <span>Patron Allowance ({discountPercent}%)</span>
                      <span>−£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="c-row">
                    <span>Express Insured Courier</span>
                    <span className="text-free">Complimentary</span>
                  </div>
                  <div className="c-row total-c-row">
                    <span>Grand Total</span>
                    <strong>£{finalTotal.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="checkout-perks micro">
                  <p>✦ Hand-cut lenses surfaced in temperature-controlled laboratory</p>
                  <p>✦ Includes full-grain British calfskin hard case</p>
                  <p>✦ 30-day effortless home trial & free lens alignment</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
