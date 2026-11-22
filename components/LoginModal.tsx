"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ATELIER_ACCOUNTS,
  type UserAccount,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  resetPassword,
  getAllAccounts,
} from "@/lib/auth";
import { FRAMES } from "@/lib/frames";

const Login3DStage = dynamic(() => import("./glasses/Login3DStage"), {
  ssr: false,
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserChange: (user: UserAccount | null) => void;
}

type AuthTab = "signin" | "register" | "forgot";

export default function LoginModal({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");

  // Sign In State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFavFrame, setRegFavFrame] = useState("rectangle");
  const [regSph, setRegSph] = useState("−2.25");
  const [regCyl, setRegCyl] = useState("−0.50");
  const [regAxis, setRegAxis] = useState("180°");
  const [regPd, setRegPd] = useState("64 mm");
  const [regNotes, setRegNotes] = useState("");

  // Forgot Password State
  const [forgotUser, setForgotUser] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSph, setEditSph] = useState("");
  const [editCyl, setEditCyl] = useState("");
  const [editAxis, setEditAxis] = useState("");
  const [editPd, setEditPd] = useState("");
  const [editFavFrame, setEditFavFrame] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Feedback State
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthTransitioning, setIsAuthTransitioning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditSph(currentUser.prescription.sph);
      setEditCyl(currentUser.prescription.cyl);
      setEditAxis(currentUser.prescription.axis);
      setEditPd(currentUser.prescription.pd);
      setEditFavFrame(currentUser.favoriteFrame);
      setEditNotes(currentUser.bespokeNotes);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    setTimeout(() => {
      const result = loginUser(username, password);
      if (result.success && result.user) {
        setIsAuthTransitioning(true);
        setTimeout(() => {
          setLoading(false);
          setIsAuthTransitioning(false);
          onUserChange(result.user!);
          setError(null);
          onClose();
        }, 1100);
      } else {
        setLoading(false);
        setError(result.error || "Authentication failed.");
      }
    }, 450);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = registerUser({
        name: regName,
        username: regUsername,
        password: regPassword,
        favoriteFrame: regFavFrame,
        prescription: {
          sph: regSph,
          cyl: regCyl,
          axis: regAxis,
          pd: regPd,
        },
        bespokeNotes: regNotes,
      });

      setLoading(false);
      if (res.success && res.user) {
        onUserChange(res.user);
        setSuccessMsg(`Welcome to the Atelier Guild, ${res.user.name}!`);
        setError(null);
      } else {
        setError(res.error || "Registration failed.");
      }
    }, 500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = resetPassword(forgotUser, forgotNewPass);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message || "Password successfully reset! You may now sign in.");
        setActiveTab("signin");
        setUsername(forgotUser);
        setPassword(forgotNewPass);
      } else {
        setError(res.error || "Unable to reset password.");
      }
    }, 500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setError(null);
    const res = updateUserProfile(currentUser.id, {
      name: editName,
      favoriteFrame: editFavFrame,
      bespokeNotes: editNotes,
      prescription: {
        sph: editSph,
        cyl: editCyl,
        axis: editAxis,
        pd: editPd,
      },
    });

    if (res.success && res.user) {
      onUserChange(res.user);
      setIsEditingProfile(false);
      setSuccessMsg("Patron optical profile updated successfully.");
    } else {
      setError(res.error || "Could not update profile.");
    }
  };

  const fillAccount = (account: (typeof ATELIER_ACCOUNTS)[0]) => {
    setActiveTab("signin");
    setUsername(account.username);
    setPassword(account.passwordHash);
    setError(null);
    setSuccessMsg(null);
  };

  const handleLogout = () => {
    logoutUser();
    onUserChange(null);
    setUsername("");
    setPassword("");
    setIsEditingProfile(false);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="login-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          type="button"
          className="login-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>

        {isAuthTransitioning && (
          <div className="auth-transition-overlay">
            <div className="auth-scanline" />
            <div className="auth-transition-content">
              <div className="auth-spinner-ring" />
              <span className="micro kicker">Authentication Verified</span>
              <h3 className="display">Welcome, {username || "Patron"}</h3>
              <p className="micro text-crimson">Synchronizing 3D Spatial Specs & VIP Privileges...</p>
            </div>
          </div>
        )}

        <div className="login-grid">
          {/* 3D Visualizer Column */}
          <div className="login-visual">
            <div className="login-visual-stage">
              <Login3DStage />
            </div>
            <div className="login-visual-overlay">
              <span className="micro">London · Sabae · Jaipur</span>
              <p className="login-visual-quote">
                “Eyewear is not an accessory. It is the bespoke architecture of your face.”
              </p>
              <div className="login-visual-status">
                <span className="status-dot is-live" />
                <span className="micro">3D Optical Engine v2.6 · Online</span>
              </div>
            </div>
          </div>

          {/* Form / Account Details Column */}
          <div className="login-content">
            <div className="login-head">
              <span className="micro kicker">Marlowe Patron Portal</span>
              <h2 className="display login-title">
                {currentUser
                  ? isEditingProfile
                    ? "Edit Profile & Prescription"
                    : "Patron Atelier"
                  : activeTab === "register"
                    ? "Create Atelier Account"
                    : activeTab === "forgot"
                      ? "Reset Access Password"
                      : "Client Sign In"}
              </h2>
              <p className="login-sub">
                {currentUser
                  ? "Your bespoke optical profile, registered prescriptions, and patron privileges."
                  : activeTab === "register"
                    ? "Register as an Atelier Guild Patron for persistent prescriptions and 10% privilege."
                    : activeTab === "forgot"
                      ? "Enter your account username and set a new password."
                      : "Sign in to access saved fitting records, prescriptions, and tailored frames."}
              </p>
            </div>

            {error && <div className="login-error">{error}</div>}
            {successMsg && <div className="login-success">{successMsg}</div>}

            {currentUser ? (
              /* Signed In Profile View */
              <div className="profile-view">
                {!isEditingProfile ? (
                  <>
                    <div className="profile-badge">
                      <div className="profile-avatar">{currentUser.avatarInitials}</div>
                      <div>
                        <h3 className="profile-name">{currentUser.name}</h3>
                        <p className="profile-role">{currentUser.role}</p>
                        <span className="profile-since">
                          Member since {currentUser.memberSince} · @{currentUser.username}
                        </span>
                      </div>
                    </div>

                    <div className="profile-details">
                      <div className="detail-item">
                        <span className="micro">Recorded Prescription (OD/OS)</span>
                        <p className="detail-value">
                          {currentUser.prescription.sph} SPH · {currentUser.prescription.cyl} CYL · Axis {currentUser.prescription.axis} · PD {currentUser.prescription.pd}
                        </p>
                      </div>
                      <div className="detail-item">
                        <span className="micro">Signature Preference</span>
                        <p className="detail-value">
                          Favorite Silhouette: <strong>{currentUser.favoriteFrame.toUpperCase()}</strong>
                        </p>
                        <p className="detail-note">{currentUser.bespokeNotes}</p>
                      </div>
                      <div className="detail-item">
                        <span className="micro">Patron Allowance</span>
                        <p className="detail-value text-brass">
                          Complimentary {currentUser.bagDiscountPercent}% VIP Glazing Privilege Active
                        </p>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        type="button"
                        className="btn btn-ink"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        Edit Profile & RX ✎
                      </button>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  /* Profile Edit Form */
                  <form onSubmit={handleSaveProfile} className="profile-edit-form">
                    <div className="form-group">
                      <label htmlFor="edit-name" className="form-label">Full Name</label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-row form-grid-4">
                      <div className="form-group">
                        <label htmlFor="edit-sph" className="form-label">SPH</label>
                        <input
                          id="edit-sph"
                          type="text"
                          value={editSph}
                          onChange={(e) => setEditSph(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edit-cyl" className="form-label">CYL</label>
                        <input
                          id="edit-cyl"
                          type="text"
                          value={editCyl}
                          onChange={(e) => setEditCyl(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edit-ax" className="form-label">Axis</label>
                        <input
                          id="edit-ax"
                          type="text"
                          value={editAxis}
                          onChange={(e) => setEditAxis(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="edit-pd" className="form-label">PD</label>
                        <input
                          id="edit-pd"
                          type="text"
                          value={editPd}
                          onChange={(e) => setEditPd(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="edit-fav" className="form-label">Favorite Frame</label>
                      <select
                        id="edit-fav"
                        value={editFavFrame}
                        onChange={(e) => setEditFavFrame(e.target.value)}
                        className="form-input"
                      >
                        {FRAMES.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.origin === "indian" ? "Indian" : "Intl"})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="edit-notes" className="form-label">Bespoke Fitting Notes</label>
                      <input
                        id="edit-notes"
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="profile-actions">
                      <button type="submit" className="btn btn-ink">
                        Save Profile Updates
                      </button>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Auth Tabs: Sign In / Register / Forgot Password */
              <div className="auth-tabbed-container">
                <div className="auth-tabs-nav" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    className={`auth-tab-btn ${activeTab === "signin" ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveTab("signin");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    className={`auth-tab-btn ${activeTab === "register" ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveTab("register");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  >
                    Register / Sign Up
                  </button>
                  <button
                    type="button"
                    role="tab"
                    className={`auth-tab-btn ${activeTab === "forgot" ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveTab("forgot");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  >
                    Forgot Password
                  </button>
                </div>

                {activeTab === "signin" && (
                  <form onSubmit={handleLoginSubmit} className="login-form">
                    <div className="form-group">
                      <label htmlFor="login-username" className="form-label">
                        Username or Email
                      </label>
                      <input
                        id="login-username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. ganeshreddy"
                        className="form-input"
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <div className="form-label-row">
                        <label htmlFor="login-password" className="form-label">
                          Unique Password
                        </label>
                        <button
                          type="button"
                          className="form-toggle-link"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <div className="password-input-wrap">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-ink btn-block login-submit"
                    >
                      {loading ? "Authenticating..." : "Enter the Atelier"}
                    </button>

                    {/* Quick 1-click test selector for demo profiles */}
                    <div className="quick-access">
                      <p className="micro quick-title">One-Click Client Demo Profiles</p>
                      <div className="quick-buttons">
                        {ATELIER_ACCOUNTS.map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            className="quick-btn"
                            onClick={() => fillAccount(acc)}
                            title={`Click to fill credentials for ${acc.name}`}
                          >
                            <span className="quick-name">{acc.name}</span>
                            <span className="quick-user">@{acc.username}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                )}

                {activeTab === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="login-form register-form">
                    <div className="form-group">
                      <label htmlFor="reg-name" className="form-label">Full Name *</label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-row form-grid-2">
                      <div className="form-group">
                        <label htmlFor="reg-user" className="form-label">Preferred Username *</label>
                        <input
                          id="reg-user"
                          type="text"
                          required
                          placeholder="e.g. rajesh"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="reg-pass" className="form-label">Password *</label>
                        <input
                          id="reg-pass"
                          type="password"
                          required
                          placeholder="Minimum 4 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row form-grid-4">
                      <div className="form-group">
                        <label htmlFor="reg-sph" className="form-label">SPH</label>
                        <input
                          id="reg-sph"
                          type="text"
                          value={regSph}
                          onChange={(e) => setRegSph(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="reg-cyl" className="form-label">CYL</label>
                        <input
                          id="reg-cyl"
                          type="text"
                          value={regCyl}
                          onChange={(e) => setRegCyl(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="reg-axis" className="form-label">Axis</label>
                        <input
                          id="reg-axis"
                          type="text"
                          value={regAxis}
                          onChange={(e) => setRegAxis(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="reg-pd" className="form-label">PD</label>
                        <input
                          id="reg-pd"
                          type="text"
                          value={regPd}
                          onChange={(e) => setRegPd(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-fav" className="form-label">Preferred Frame</label>
                      <select
                        id="reg-fav"
                        value={regFavFrame}
                        onChange={(e) => setRegFavFrame(e.target.value)}
                        className="form-input"
                      >
                        {FRAMES.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.origin === "indian" ? "🇮🇳 Indian" : "🇬🇧 Intl"})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-notes" className="form-label">Bespoke Optical Notes (Optional)</label>
                      <input
                        id="reg-notes"
                        type="text"
                        placeholder="e.g. Sensitive to glare, prefers blue-cut coating"
                        value={regNotes}
                        onChange={(e) => setRegNotes(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-ink btn-block login-submit"
                    >
                      {loading ? "Creating Patron Account..." : "Create Patron Account & Sign In"}
                    </button>
                  </form>
                )}

                {activeTab === "forgot" && (
                  <form onSubmit={handleForgotSubmit} className="login-form">
                    <p className="micro text-muted" style={{ marginBottom: "16px" }}>
                      Forgot your credentials? Enter your account username and define a replacement password to regain access immediately.
                    </p>

                    <div className="form-group">
                      <label htmlFor="forgot-user" className="form-label">Account Username</label>
                      <input
                        id="forgot-user"
                        type="text"
                        required
                        placeholder="e.g. ganeshreddy"
                        value={forgotUser}
                        onChange={(e) => setForgotUser(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="forgot-pass" className="form-label">New Password</label>
                      <input
                        id="forgot-pass"
                        type="password"
                        required
                        placeholder="Enter new replacement password"
                        value={forgotNewPass}
                        onChange={(e) => setForgotNewPass(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-ink btn-block login-submit"
                    >
                      {loading ? "Resetting Password..." : "Update Password & Return to Login"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
