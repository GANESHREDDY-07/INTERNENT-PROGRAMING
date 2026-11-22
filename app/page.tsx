"use client";

import { useEffect, useState } from "react";
import AnchorScroll from "@/components/AnchorScroll";
import Atelier from "@/components/Atelier";
import CollectionsSection from "@/components/CollectionsSection";
import FitGuide from "@/components/FitGuide";
import Hero from "@/components/Hero";
import LensLab from "@/components/LensLab";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import Ticker from "@/components/Ticker";
import LoginModal from "@/components/LoginModal";
import BagDrawer, { type BagItem } from "@/components/BagDrawer";
import AiStylist from "@/components/AiStylist";
import MagneticCursor from "@/components/MagneticCursor";
import SettingsPanel, { type ThemeMode } from "@/components/SettingsPanel";
import WebcamTryOn from "@/components/WebcamTryOn";
import SplitStageModal from "@/components/SplitStageModal";
import {
  type FrameConfig,
  type FrameId,
  type TintId,
  type LensTypeId,
  getColour,
  getFrame,
  getTint,
  getLensType,
} from "@/lib/frames";
import { getCurrentUser, type UserAccount } from "@/lib/auth";
import { scrollToId } from "@/lib/scroll";

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("cyber-crimson");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [config, setConfig] = useState<FrameConfig>({
    frameId: "rectangle",
    colourId: "crimson_titanium",
    tintId: "clear",
    lensTypeId: "anti-glare",
    isExploded: false,
    engravedText: "GANESH REDDY · 001",
  });

  const [bagItems, setBagItems] = useState<BagItem[]>([
    {
      id: "initial-sample",
      frameId: "rectangle",
      colourId: "crimson_titanium",
      tintId: "clear",
      lensTypeId: "blue-cut",
      quantity: 1,
    },
  ]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);

  const [toast, setToast] = useState<{ id: number; message: string; actionLabel?: string } | null>(
    null,
  );

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    if (typeof window !== "undefined") {
      const storedTheme = (localStorage.getItem("marlowe_theme") as ThemeMode) || "cyber-crimson";
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("marlowe_theme", newTheme);
  };

  const frame = getFrame(config.frameId);
  const tint = getTint(config.tintId);

  const changeFrame = (id: FrameId) => {
    const next = getFrame(id);
    setConfig((current) => ({
      ...current,
      frameId: id,
      colourId: next.colours[0].id,
    }));
  };

  const selectFrame = (id: FrameId) => {
    changeFrame(id);
    requestAnimationFrame(() => scrollToId("atelier"));
  };

  const addToBagCurrent = () => {
    const colour = getColour(frame, config.colourId);
    const lens = getLensType(config.lensTypeId);
    const existingIndex = bagItems.findIndex(
      (it) =>
        it.frameId === config.frameId &&
        it.colourId === config.colourId &&
        it.tintId === config.tintId &&
        it.lensTypeId === (config.lensTypeId || "anti-glare"),
    );

    if (existingIndex > -1) {
      setBagItems((prev) =>
        prev.map((it, idx) =>
          idx === existingIndex ? { ...it, quantity: it.quantity + 1 } : it,
        ),
      );
    } else {
      setBagItems((prev) => [
        ...prev,
        {
          id: `${config.frameId}-${Date.now()}`,
          frameId: config.frameId,
          colourId: config.colourId,
          tintId: config.tintId,
          lensTypeId: config.lensTypeId || "anti-glare",
          quantity: 1,
        },
      ]);
    }

    setToast({
      id: Date.now(),
      message: `Added to fitting bag: ${frame.name} (${colour.name}) · ${lens.badge}`,
      actionLabel: "Open Bag",
    });
  };

  const addSpecificFrameToBag = (frameId: FrameId) => {
    const targetFrame = getFrame(frameId);
    const defaultColour = targetFrame.colours[0].id;
    const defaultTint = "clear";
    const defaultLens = "anti-glare";

    setBagItems((prev) => [
      ...prev,
      {
        id: `${frameId}-${Date.now()}`,
        frameId,
        colourId: defaultColour,
        tintId: defaultTint,
        lensTypeId: defaultLens,
        quantity: 1,
      },
    ]);

    setToast({
      id: Date.now(),
      message: `Added ${targetFrame.name} to fitting bag`,
      actionLabel: "Open Bag",
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as BagItem[],
    );
  };

  const removeItem = (id: string) => {
    setBagItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearBag = () => {
    setBagItems([]);
  };

  const totalBagCount = bagItems.reduce((acc, it) => acc + it.quantity, 0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <AnchorScroll />
      <MagneticCursor />

      <SiteNav
        bagCount={totalBagCount}
        onOpenBag={() => setIsBagOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenStylist={() => setIsStylistOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main>
        <Hero />
        <Ticker />
        <Atelier
          config={config}
          onFrameChange={changeFrame}
          onColourChange={(colourId) =>
            setConfig((current) => ({ ...current, colourId }))
          }
          onTintChange={(tintId: TintId) =>
            setConfig((current) => ({ ...current, tintId }))
          }
          onLensTypeChange={(lensTypeId: LensTypeId) =>
            setConfig((current) => ({ ...current, lensTypeId }))
          }
          onExplodeToggle={() =>
            setConfig((current) => ({ ...current, isExploded: !current.isExploded }))
          }
          onEngravingChange={(engravedText) =>
            setConfig((current) => ({ ...current, engravedText }))
          }
          onOpenAR={() => setIsAROpen(true)}
          onOpenCompare={() => setIsCompareOpen(true)}
          onAdd={addToBagCurrent}
        />
        <CollectionsSection
          onSelectFrame={selectFrame}
          onQuickAdd={addSpecificFrameToBag}
        />
        <LensLab tint={tint} />
        <FitGuide onSelectFrame={selectFrame} />
      </main>

      <SiteFooter />

      {/* Floating Interactive AI Optical Stylist */}
      <AiStylist
        currentUser={currentUser}
        onSelectFrame={selectFrame}
        onAddToBag={addSpecificFrameToBag}
        isOpen={isStylistOpen}
        onToggle={() => setIsStylistOpen(!isStylistOpen)}
      />

      {/* Fully Functional Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onThemeChange={handleThemeChange}
        currentTheme={theme}
      />

      {/* Real-Time Webcam Virtual Try-On AR Mirror */}
      <WebcamTryOn
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        frame={frame}
        onSelectFrame={changeFrame}
      />

      {/* Quick-Compare 3D Split Stage */}
      <SplitStageModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        initialFrameAId={config.frameId}
        onAddToBag={addSpecificFrameToBag}
      />

      {/* 3D Login & Patron Profile Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* Interactive Fitting Bag Drawer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearBag={clearBag}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Toast Notification */}
      <div className={`toast ${toast ? "is-on" : ""}`} role="status">
        <span>{toast?.message}</span>
        {toast?.actionLabel && (
          <button
            type="button"
            className="toast-action-btn"
            onClick={() => setIsBagOpen(true)}
          >
            {toast.actionLabel} →
          </button>
        )}
      </div>
    </>
  );
}
