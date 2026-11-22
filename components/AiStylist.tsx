"use client";

import { useEffect, useRef, useState } from "react";
import FrameThumb from "./FrameThumb";
import {
  FRAMES,
  type Frame,
  type FrameId,
  type TintId,
  getFrame,
} from "@/lib/frames";
import { type UserAccount } from "@/lib/auth";
import { soundFx } from "@/lib/sound";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  recommendedFrameId?: FrameId;
  suggestedTintId?: TintId;
  actionButtons?: {
    label: string;
    action: "selectFrame" | "addToBag" | "scrollSection";
    targetId?: string;
  }[];
}

interface AiStylistProps {
  currentUser: UserAccount | null;
  onSelectFrame: (id: FrameId) => void;
  onSelectTint?: (tintId: TintId) => void;
  onAddToBag: (frameId: FrameId) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const QUICK_PROMPTS = [
  "Show me Indian Heritage frames (Rectangle, Circle, Retro)",
  "What are the 4 Lens Glazing options?",
  "Recommend frame for round face",
  "Recommend frame for oval face",
  "Best lenses for screen work & digital eye strain (Blue-Cut)",
  "Show me featherlight titanium frames",
];

export default function AiStylist({
  currentUser,
  onSelectFrame,
  onAddToBag,
  isOpen,
  onToggle,
}: AiStylistProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // 3-Step Matcher Quiz State
  const [quizStep, setQuizStep] = useState<1 | 2 | 3>(1);
  const [quizFace, setQuizFace] = useState<string>("oval");
  const [quizLifestyle, setQuizLifestyle] = useState<string>("digital");
  const [quizAesthetic, setQuizAesthetic] = useState<string>("cyber");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    const greeting = currentUser
      ? `Greetings, ${currentUser.name}. I see you are registered as a ${currentUser.role}. Your prescription (${currentUser.prescription.sph} SPH, PD ${currentUser.prescription.pd}) is on file. Shall we calibrate your bespoke ${currentUser.favoriteFrame.toUpperCase()} frame, or discover our new Indian Heritage & Cyber-Luxury series?`
      : "Welcome to Marlowe Optical Atelier. I am your voice-enabled AI Optical Stylist. Tell me your face shape or daily routine, or launch our 3-Step Matcher Quiz to calibrate your silhouette.";

    setMessages([
      {
        id: "initial",
        sender: "ai",
        text: greeting,
        timestamp: "Just now",
        actionButtons: [
          { label: "✦ 3-Step Face Matcher Quiz", action: "selectFrame", targetId: "open-quiz" },
          { label: "Find by Face Shape", action: "scrollSection", targetId: "fit" },
        ],
      },
    ]);
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Text-To-Speech Synthesis
  const speakText = (text: string) => {
    if (!voiceSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    soundFx.playClick();
    if (typeof window === "undefined") return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Speech recognition is not supported in this browser. Please use keyboard input.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      soundFx.playHover();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (transcript) {
        handleSend(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    soundFx.playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: "Now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(query, currentUser);
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
      speakText(response.text);
    }, 550);
  };

  const executeAction = (action: string, targetId?: string) => {
    soundFx.playClick();
    if (targetId === "open-quiz") {
      setShowQuiz(true);
      return;
    }
    if (action === "selectFrame" && targetId) {
      onSelectFrame(targetId as FrameId);
      const el = document.getElementById("atelier");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (action === "addToBag" && targetId) {
      onAddToBag(targetId as FrameId);
    } else if (action === "scrollSection" && targetId) {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: "smooth" });
      onToggle();
    }
  };

  // Complete 3-Step Matcher Quiz
  const handleCompleteQuiz = () => {
    soundFx.playAuthSuccess();
    setShowQuiz(false);

    let matchFrameId: FrameId = "rectangle";
    let matchReason = "";

    if (quizFace === "round") {
      matchFrameId = quizAesthetic === "indian" ? "rectangle" : "atlas";
      matchReason = "Angular rectangular architecture sharpens softer facial curves.";
    } else if (quizFace === "oval") {
      matchFrameId = quizAesthetic === "indian" ? "aviator" : "meridian";
      matchReason = "Balanced geometric proportions harmonizing with cheekbone poise.";
    } else if (quizFace === "square") {
      matchFrameId = quizAesthetic === "indian" ? "circle" : "aurelia";
      matchReason = "Pure circular wire relaxes broad jawline geometry naturally.";
    } else {
      matchFrameId = quizAesthetic === "cyber" ? "retro" : "vale";
      matchReason = "Bottom-balanced contour accentuates narrower chin symmetry.";
    }

    const recFrame = getFrame(matchFrameId);
    const recMsg: Message = {
      id: Date.now().toString(),
      sender: "ai",
      text: `Quiz Complete! Based on your ${quizFace.toUpperCase()} face shape, ${quizLifestyle} routine, and ${quizAesthetic} aesthetic, your optimal optical match is the ${recFrame.name} (${recFrame.origin === "indian" ? "🇮🇳 Indian Heritage" : "🇬🇧 International Archive"}). ${matchReason}`,
      timestamp: "Just now",
      recommendedFrameId: recFrame.id,
      actionButtons: [
        { label: `Load ${recFrame.name} in 3D Atelier ↗`, action: "selectFrame", targetId: recFrame.id },
        { label: "Add to Fitting Bag +", action: "addToBag", targetId: recFrame.id },
      ],
    };

    setMessages((prev) => [...prev, recMsg]);
    onSelectFrame(recFrame.id);
    speakText(recMsg.text);
  };

  return (
    <>
      {/* Floating launcher badge */}
      <button
        type="button"
        className={`stylist-bubble ${isOpen ? "is-active" : ""}`}
        onClick={() => {
          soundFx.playClick();
          onToggle();
        }}
        aria-label="Toggle AI Optical Stylist"
      >
        <div className="stylist-bubble-pulse" />
        <span className="stylist-bubble-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="6" cy="12" r="4" />
            <circle cx="18" cy="12" r="4" />
            <path d="M10 12h4" />
            <path d="M2 12l2-4M22 12l-2-4" />
          </svg>
        </span>
        <span className="stylist-bubble-text">
          <span className="stylist-bubble-name">AI Stylist</span>
          <span className="stylist-bubble-sub">Voice & Face Matcher</span>
        </span>
      </button>

      {/* Slide-out chat drawer */}
      {isOpen && (
        <div className="stylist-panel" role="complementary" aria-label="AI Stylist Assistant">
          <div className="stylist-header">
            <div className="stylist-header-title">
              <span className="status-dot is-live" />
              <div>
                <h3 className="stylist-title">Marlowe AI Stylist</h3>
                <p className="micro">Voice-Enabled Intelligent Optical Concierge</p>
              </div>
            </div>
            <div className="stylist-header-actions">
              {/* Voice TTS Toggle */}
              <button
                type="button"
                className={`stylist-tts-btn ${voiceSpeechEnabled ? "is-speaking" : ""}`}
                onClick={() => {
                  soundFx.playClick();
                  setVoiceSpeechEnabled(!voiceSpeechEnabled);
                }}
                title={voiceSpeechEnabled ? "Voice Output Active" : "Enable Voice Output"}
              >
                {voiceSpeechEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
              </button>
              <button
                type="button"
                className="stylist-close"
                onClick={onToggle}
                aria-label="Close Stylist"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="stylist-body">
            {/* Interactive 3-Step Matcher Quiz Modal Banner */}
            {showQuiz ? (
              <div className="stylist-quiz-card">
                <div className="quiz-head">
                  <span className="micro kicker">Interactive Calibration</span>
                  <h4>Step {quizStep} of 3: {quizStep === 1 ? "Face Shape" : quizStep === 2 ? "Daily Environment" : "Aesthetic Vibe"}</h4>
                </div>

                {quizStep === 1 && (
                  <div className="quiz-options-list">
                    <p className="micro text-muted">What describes your facial bone structure?</p>
                    {(["oval", "round", "square", "heart"] as const).map((face) => (
                      <button
                        key={face}
                        type="button"
                        className={`quiz-option-btn ${quizFace === face ? "is-selected" : ""}`}
                        onClick={() => {
                          soundFx.playClick();
                          setQuizFace(face);
                          setQuizStep(2);
                        }}
                      >
                        <strong>{face.toUpperCase()}</strong>
                        <span className="micro">
                          {face === "oval" ? "Balanced, slightly longer than wide" : face === "round" ? "Soft curves, fuller cheeks" : face === "square" ? "Strong jaw, broad brow" : "Wider brow, tapered chin"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {quizStep === 2 && (
                  <div className="quiz-options-list">
                    <p className="micro text-muted">Where do you spend most of your waking hours?</p>
                    {[
                      { id: "digital", label: "Digital Displays & Coding", sub: "Screen work, heavy blue light exposure" },
                      { id: "outdoor", label: "Outdoor & High-Glare Driving", sub: "Direct sunlight, active lifestyle" },
                      { id: "studio", label: "Design Studio & Fine Architecture", sub: "Precision detail & color fidelity" },
                    ].map((env) => (
                      <button
                        key={env.id}
                        type="button"
                        className={`quiz-option-btn ${quizLifestyle === env.id ? "is-selected" : ""}`}
                        onClick={() => {
                          soundFx.playClick();
                          setQuizLifestyle(env.id);
                          setQuizStep(3);
                        }}
                      >
                        <strong>{env.label}</strong>
                        <span className="micro">{env.sub}</span>
                      </button>
                    ))}
                  </div>
                )}

                {quizStep === 3 && (
                  <div className="quiz-options-list">
                    <p className="micro text-muted">Select your signature stylistic direction:</p>
                    {[
                      { id: "cyber", label: "Red & Black Cyber-Luxury", sub: "Crimson titanium & matte carbon fiber" },
                      { id: "indian", label: "Indian Heritage Archive", sub: "Madras tortoiseshell, Haveli amber, Jaipur brass" },
                      { id: "classic", label: "International Minimalist Wire", sub: "Featherlight Japanese beta-titanium wire" },
                    ].map((aes) => (
                      <button
                        key={aes.id}
                        type="button"
                        className={`quiz-option-btn ${quizAesthetic === aes.id ? "is-selected" : ""}`}
                        onClick={() => {
                          soundFx.playClick();
                          setQuizAesthetic(aes.id);
                        }}
                      >
                        <strong>{aes.label}</strong>
                        <span className="micro">{aes.sub}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      className="btn btn-ink btn-block"
                      style={{ marginTop: "12px" }}
                      onClick={handleCompleteQuiz}
                    >
                      Calibrate & Inspect in 3D ⚡
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="stylist-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`stylist-msg is-${msg.sender}`}>
                    <div className="msg-bubble">
                      <p className="msg-text">{msg.text}</p>

                      {msg.recommendedFrameId && (
                        <div className="msg-card">
                          {(() => {
                            const frame = getFrame(msg.recommendedFrameId);
                            return (
                              <>
                                <div className="msg-card-thumb">
                                  <FrameThumb
                                    frame={frame}
                                    strokeColor="#ff2a4d"
                                  />
                                </div>
                                <div className="msg-card-meta">
                                  <div className="msg-card-title-row">
                                    <strong>{frame.name}</strong>
                                    <span>£{frame.price}</span>
                                  </div>
                                  <p className="micro">{frame.tagline}</p>
                                  <div className="msg-card-actions">
                                    <button
                                      type="button"
                                      className="btn-card-action"
                                      onClick={() => executeAction("selectFrame", frame.id)}
                                    >
                                      Load in 3D Atelier ↗
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-card-action is-primary"
                                      onClick={() => executeAction("addToBag", frame.id)}
                                    >
                                      Add to Bag +
                                    </button>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {msg.actionButtons && msg.actionButtons.length > 0 && (
                        <div className="msg-action-pills">
                          {msg.actionButtons.map((btn, i) => (
                            <button
                              key={i}
                              type="button"
                              className="msg-pill"
                              onClick={() => executeAction(btn.action, btn.targetId)}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="msg-time">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="stylist-msg is-ai">
                    <div className="msg-bubble typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Prompt Suggestions */}
            {!showQuiz && (
              <div className="stylist-quick-prompts">
                <span className="micro">Quick Suggestions:</span>
                <div className="quick-prompt-scroll">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-prompt-chip"
                      onClick={() => handleSend(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chat Input with Voice Speech Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="stylist-footer"
          >
            <button
              type="button"
              className={`stylist-mic-btn ${isListening ? "is-recording" : ""}`}
              onClick={toggleListening}
              title={isListening ? "Listening... Speak now" : "Speak to AI Stylist"}
            >
              🎤
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Ask about face shapes, tints, or prescriptions..."}
              className="stylist-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="stylist-send"
              aria-label="Send message"
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function generateAIResponse(query: string, user: UserAccount | null): Message {
  const lower = query.toLowerCase();

  // Indian collection inquiries
  if (lower.includes("india") || lower.includes("indian") || lower.includes("heritage")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "Our new 2026 Indian Heritage collection features 6 architectural silhouettes celebrating iconic Indian proportions: Arya Rectangle, Ashoka Circle wire, Ganga Oval, Swaraj Round panto, Bombay Retro browline, and the Garuda Aviator. Which aesthetic speaks to your style?",
      timestamp: "Now",
      recommendedFrameId: "rectangle",
      actionButtons: [
        { label: "View Arya Rectangle in 3D", action: "selectFrame", targetId: "rectangle" },
        { label: "View Ashoka Circle Wire", action: "selectFrame", targetId: "circle" },
        { label: "Explore Bombay Retro", action: "selectFrame", targetId: "retro" },
      ],
    };
  }

  // 4 Lens Formulations inquiries
  if (lower.includes("lens") || lower.includes("glazing") || lower.includes("coating") || lower.includes("photochromic") || lower.includes("anti-glare") || lower.includes("blue-cut") || lower.includes("high-index") || lower.includes("thin")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "We offer 4 specialized master lens glazing formulations:\n1. Anti-Glare (AR) Lenses: 9-layer hydrophobic reflection cancellation.\n2. Blue-Cut Lenses: Blocks 415-455nm digital blue rays for screen work.\n3. Photochromic Transitions: Dynamic molecular UV shift from indoor clear to sunglass.\n4. 1.74 High-Index Lenses: 45% thinner compressed profile for high prescriptions.",
      timestamp: "Now",
      actionButtons: [
        { label: "Inspect Lens Lab & Simulators", action: "scrollSection", targetId: "lens" },
        { label: "Open Atelier 3D Customizer", action: "scrollSection", targetId: "atelier" },
      ],
    };
  }

  // Face shape queries
  if (lower.includes("round face") || lower.includes("round")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "For a round face, structured geometric lines contrast beautifully with softer cheek contours. I strongly recommend the new Arya Rectangle (Indian Madras acetate) or Atlas (architectural titanium). Both impart distinguished browline composure.",
      timestamp: "Now",
      recommendedFrameId: "rectangle",
      actionButtons: [
        { label: "Examine Arya Rectangle in 3D", action: "selectFrame", targetId: "rectangle" },
        { label: "Examine Atlas Titanium", action: "selectFrame", targetId: "atlas" },
      ],
    };
  }

  if (lower.includes("oval face") || lower.includes("oval")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "Oval faces possess naturally balanced proportions and can carry nearly any silhouette. The Meridian's hand-polished rectangle, Garuda aviator, or the Ganga oval will accentuate your cheekbones effortlessly.",
      timestamp: "Now",
      recommendedFrameId: "aviator",
      actionButtons: [
        { label: "Load Garuda Aviator in 3D", action: "selectFrame", targetId: "aviator" },
        { label: "Load Meridian Rectangle", action: "selectFrame", targetId: "meridian" },
      ],
    };
  }

  if (lower.includes("square face") || lower.includes("square")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "To soften angular jawlines and broad foreheads, curved silhouettes create perfect balance. The Ashoka circle wire in titanium or the Ganga soft oval harmonize naturally.",
      timestamp: "Now",
      recommendedFrameId: "circle",
      actionButtons: [
        { label: "Load Ashoka Circle Wire", action: "selectFrame", targetId: "circle" },
        { label: "View Aurelia Panto", action: "selectFrame", targetId: "aurelia" },
      ],
    };
  }

  if (lower.includes("screen") || lower.includes("computer") || lower.includes("digital") || lower.includes("blue")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "For long screen sessions, digital blue-light frequency fatigue is common. We recommend our Blue-Cut Nanotech Filter, paired with Rose or Sepia tints in the 3D Atelier.",
      timestamp: "Now",
      suggestedTintId: "sepia",
      actionButtons: [
        { label: "Visit The Lens Lab", action: "scrollSection", targetId: "lens" },
      ],
    };
  }

  if (lower.includes("titanium") || lower.includes("weight") || lower.includes("light")) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "Our Titanium Precision series uses pure Japanese beta-titanium milled in Sabae, Japan. The new Zephyr weighs just 14 grams, while the Ashoka circle is under 13 grams.",
      timestamp: "Now",
      recommendedFrameId: "circle",
      actionButtons: [
        { label: "Inspect Ashoka Wire (13g)", action: "selectFrame", targetId: "circle" },
        { label: "View Atlas Titanium", action: "selectFrame", targetId: "atlas" },
      ],
    };
  }

  if (lower.includes("ganesh") || (user && user.id === "ganesh" && lower.includes("me"))) {
    return {
      id: Date.now().toString(),
      sender: "ai",
      text: "Ganesh, based on your recorded prescription (SPH -2.50) and preference for clean geometric balance, we recommend the Arya Rectangle in Madras Tortoise or Meridian with 1.74 High-Index glazing. It provides razor-sharp clarity and timeless poise.",
      timestamp: "Now",
      recommendedFrameId: "rectangle",
      actionButtons: [
        { label: "Load Ganesh's Arya Rectangle", action: "selectFrame", targetId: "rectangle" },
        { label: "Apply 15% VIP Privilege", action: "addToBag", targetId: "rectangle" },
      ],
    };
  }

  // Default recommendation
  const randomFrame = FRAMES[Math.floor(Math.random() * FRAMES.length)];
  return {
    id: Date.now().toString(),
    sender: "ai",
    text: `Every Marlowe frame is drawn by hand and glazed to your exact optical coordinates. Take a look at the ${randomFrame.name}: ${randomFrame.description}`,
    timestamp: "Now",
    recommendedFrameId: randomFrame.id,
    actionButtons: [
      { label: `View ${randomFrame.name} in 3D`, action: "selectFrame", targetId: randomFrame.id },
      { label: "Browse Collections", action: "scrollSection", targetId: "collections" },
    ],
  };
}
