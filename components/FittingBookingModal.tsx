"use client";

import { useState, useEffect, type FormEvent } from "react";
import { soundFx } from "@/lib/sound";
import { type UserAccount } from "@/lib/auth";
import { FRAMES, type Frame } from "@/lib/frames";

interface FittingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
}

interface BookingDetails {
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  timeSlot: string;
  selectedFrames: string[];
  consultationType: string;
  notes: string;
  createdAt: string;
}

const ATELIER_LOCATIONS = [
  {
    id: "london",
    name: "London Flagship Atelier",
    address: "14 Chiltern St, Marylebone, London W1U 7PT",
    badge: "🇬🇧 Flagship",
    slots: "Tue – Sat · Private Suite",
  },
  {
    id: "india_delhi",
    name: "New Delhi VIP Lounge",
    address: "Connaught Place / Diplomatic Enclave, New Delhi",
    badge: "🇮🇳 Heritage",
    slots: "Daily · Master Craftsman",
  },
  {
    id: "india_mumbai",
    name: "Mumbai Heritage Atelier",
    address: "Bandra West / Colaba Arts District, Mumbai",
    badge: "🇮🇳 Heritage",
    slots: "Daily · Bespoke Salon",
  },
  {
    id: "virtual",
    name: "Virtual 3D Stylist Consultation",
    address: "Live High-Definition Web AR & Video Session",
    badge: "🌐 Worldwide",
    slots: "Flexible 24/7 Timezones",
  },
];

const TIME_SLOTS = [
  "10:30 AM — Morning Quiet Atelier",
  "01:30 PM — Afternoon Master Fitting",
  "04:00 PM — Golden Hour Consultation",
  "06:30 PM — Evening VIP Private Salon",
];

const CONSULTATION_FOCUS = [
  "Complete Eye Refraction & Prescription Exam",
  "3D Facial Anatomy & Frame Silhouette Matching",
  "Blue-Cut Digital Light & High-Index Glazing",
  "Bespoke Temple Laser Engraving & Custom Acetate",
];

export default function FittingBookingModal({
  isOpen,
  onClose,
  currentUser,
}: FittingBookingModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("london");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1]);
  const [selectedFrames, setSelectedFrames] = useState<string[]>([
    "rectangle",
    "circle",
  ]);
  const [consultationType, setConsultationType] = useState(CONSULTATION_FOCUS[1]);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(
    null
  );

  // Auto-fill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setEmail(currentUser.email || `${currentUser.username}@atelier.vip`);
    }
  }, [currentUser]);

  // Set default appointment date to 3 days from now
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleFrameSelection = (frameId: string) => {
    soundFx.playClick();
    setSelectedFrames((prev) =>
      prev.includes(frameId)
        ? prev.filter((id) => id !== frameId)
        : [...prev, frameId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !date) return;

    soundFx.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const locObj = ATELIER_LOCATIONS.find((l) => l.id === location);
      const bookingData: BookingDetails = {
        bookingId: `VIP-LON-${randomNum}`,
        fullName,
        email,
        phone: phone || "+44 20 7946 0018",
        location: locObj ? locObj.name : "London Flagship Atelier",
        date,
        timeSlot,
        selectedFrames,
        consultationType,
        notes,
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      try {
        localStorage.setItem("marlowe_vip_booking", JSON.stringify(bookingData));
      } catch {
        // Ignore storage error
      }

      setIsSubmitting(false);
      setConfirmedBooking(bookingData);
      soundFx.playAuthSuccess();
    }, 900);
  };

  return (
    <div
      className="booking-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="booking-modal">
        {/* Modal Close Button */}
        <button
          type="button"
          className="booking-close-btn"
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          aria-label="Close booking window"
        >
          ✕
        </button>

        {!confirmedBooking ? (
          <div className="booking-content-scroll">
            {/* Header with Cyber Orange Aura */}
            <div className="booking-header">
              <div className="booking-kicker-tag">
                <span className="booking-pulse-dot" />
                <span>PRIVATE ATELIER RESERVATION</span>
              </div>
              <h2 id="booking-title" className="booking-title display">
                Book a Private Fitting.
                <br />
                <span className="booking-title-accent">Curated to Your Measure.</span>
              </h2>
              <p className="booking-desc">
                Experience one-on-one biometric optical sizing, bespoke material selection,
                and custom optical alignment with a master optical artisan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              {/* SECTION 1: Personal Details */}
              <div className="booking-section">
                <h3 className="booking-section-title">
                  <span className="step-num">01</span> Guest Identification
                </h3>
                <div className="booking-fields-grid">
                  <div className="booking-field">
                    <label htmlFor="booking-name" className="booking-label">
                      Full Name *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      className="booking-input"
                      required
                      placeholder="e.g. Lord Ganesh Reddy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-email" className="booking-label">
                      Email Address *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      className="booking-input"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="booking-phone" className="booking-label">
                      Telephone / WhatsApp *
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      className="booking-input"
                      required
                      placeholder="+44 20 7946 0018 / +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Select Atelier Destination */}
              <div className="booking-section">
                <h3 className="booking-section-title">
                  <span className="step-num">02</span> Atelier Destination
                </h3>
                <div className="location-cards-grid">
                  {ATELIER_LOCATIONS.map((loc) => {
                    const isSelected = location === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        className={`location-card ${isSelected ? "is-active" : ""}`}
                        onClick={() => {
                          soundFx.playClick();
                          setLocation(loc.id);
                        }}
                      >
                        <div className="loc-card-head">
                          <span className="loc-badge">{loc.badge}</span>
                          <span className="loc-radio-circle">
                            {isSelected && <span className="loc-radio-inner" />}
                          </span>
                        </div>
                        <h4 className="loc-name">{loc.name}</h4>
                        <p className="loc-address micro">{loc.address}</p>
                        <span className="loc-slots micro">{loc.slots}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Date & Preferred Time */}
              <div className="booking-section">
                <h3 className="booking-section-title">
                  <span className="step-num">03</span> Date & VIP Salon Time
                </h3>
                <div className="booking-time-grid">
                  <div className="booking-field">
                    <label htmlFor="booking-date" className="booking-label">
                      Appointment Date *
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      className="booking-input booking-date-input"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="booking-field">
                    <label className="booking-label">Preferred Session Slot</label>
                    <div className="time-slots-list">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = timeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot-btn ${isSelected ? "is-active" : ""}`}
                            onClick={() => {
                              soundFx.playClick();
                              setTimeSlot(slot);
                            }}
                          >
                            <span className="slot-dot" />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Preferred Frames & Focus */}
              <div className="booking-section">
                <h3 className="booking-section-title">
                  <span className="step-num">04</span> Frame Silhouettes to Prepare
                </h3>
                <p className="micro text-muted" style={{ marginBottom: "12px" }}>
                  Select the frames you wish to inspect and try on in your private fitting tray:
                </p>
                <div className="frames-select-pills">
                  {FRAMES.map((f: Frame) => {
                    const isSelected = selectedFrames.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        className={`frame-select-pill ${isSelected ? "is-selected" : ""}`}
                        onClick={() => toggleFrameSelection(f.id)}
                      >
                        <span className="pill-origin">
                          {f.origin === "indian" ? "🇮🇳" : "🇬🇧"}
                        </span>
                        <span className="pill-name">{f.name}</span>
                        {isSelected && <span className="pill-check">✓</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="booking-field" style={{ marginTop: "18px" }}>
                  <label htmlFor="consult-focus" className="booking-label">
                    Primary Consultation Objective
                  </label>
                  <select
                    id="consult-focus"
                    className="booking-select"
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                  >
                    {CONSULTATION_FOCUS.map((cf) => (
                      <option key={cf} value={cf}>
                        {cf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="booking-field" style={{ marginTop: "14px" }}>
                  <label htmlFor="booking-notes" className="booking-label">
                    Special Requests, Prescription Details or Preferences (Optional)
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    className="booking-textarea"
                    placeholder="e.g. Interested in custom damascus steel temples with laser monogram, or pupil distance measurements."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Form Footer Action */}
              <div className="booking-submit-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-booking-submit"
                >
                  {isSubmitting ? (
                    <span className="booking-loading">
                      <span className="booking-spinner" />
                      Securing VIP Appointment...
                    </span>
                  ) : (
                    <>
                      <span>CONFIRM PRIVATE FITTING RESERVATION</span>
                      <span className="btn-arrow">↗</span>
                    </>
                  )}
                </button>
                <p className="micro text-muted booking-guarantee">
                  ✦ Complimentary private fitting · Includes lens consultation & optical beverage service.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* VIP CONFIRMATION PASS SCREEN */
          <div className="booking-confirmed-card">
            <div className="vip-pass-header">
              <span className="vip-pass-badge">✦ OFFICIAL ATELIER VIP PASS</span>
              <div className="vip-pass-code">{confirmedBooking.bookingId}</div>
            </div>

            <div className="vip-pass-body">
              <div className="vip-success-icon">✓</div>
              <h3 className="display vip-pass-title">
                Fitting Confirmed, {confirmedBooking.fullName.split(" ")[0]}.
              </h3>
              <p className="vip-pass-subtitle">
                A private fitting suite and dedicated optical artisan have been reserved
                exclusively for you. An invitation confirmation has also been dispatched to{" "}
                <strong>{confirmedBooking.email}</strong>.
              </p>

              <div className="vip-details-box">
                <div className="vip-detail-row">
                  <span className="vip-detail-label">Location:</span>
                  <span className="vip-detail-value">{confirmedBooking.location}</span>
                </div>
                <div className="vip-detail-row">
                  <span className="vip-detail-label">Date & Time:</span>
                  <span className="vip-detail-value">
                    {confirmedBooking.date} · {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div className="vip-detail-row">
                  <span className="vip-detail-label">Curated Tray:</span>
                  <span className="vip-detail-value">
                    {confirmedBooking.selectedFrames.length > 0
                      ? confirmedBooking.selectedFrames
                          .map((id) => FRAMES.find((f) => f.id === id)?.name || id)
                          .join(", ")
                      : "Full Atelier Archive"}
                  </span>
                </div>
                <div className="vip-detail-row">
                  <span className="vip-detail-label">Consultation Scope:</span>
                  <span className="vip-detail-value">
                    {confirmedBooking.consultationType}
                  </span>
                </div>
              </div>

              <div className="vip-pass-actions">
                <button
                  type="button"
                  className="btn-booking-submit"
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                >
                  RETURN TO ATELIER
                </button>
                <button
                  type="button"
                  className="btn-booking-print"
                  onClick={() => window.print()}
                >
                  🖨 Print / Save VIP Pass
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
