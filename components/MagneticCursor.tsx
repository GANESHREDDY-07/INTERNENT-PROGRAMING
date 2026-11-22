"use client";

import { useEffect, useState } from "react";
import { soundFx } from "@/lib/sound";

export default function MagneticCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPos({ x: e.clientX, y: e.clientY });

      // Update CSS variables for root spotlight aura
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest(".col-card") ||
          target.closest(".lens-card") ||
          target.closest("[role='button']")
        );
        setIsPointer(isClickable);

        // 3D Tilt calculation on card hover
        const card = target.closest(".col-card, .lens-card, .stage-canvas") as HTMLElement | null;
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardX = e.clientX - rect.left;
          const cardY = e.clientY - rect.top;
          const rotateX = ((cardY - rect.height / 2) / (rect.height / 2)) * -6.5;
          const rotateY = ((cardX - rect.width / 2) / (rect.width / 2)) * 6.5;
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      // Reset tilt on cards
      document.querySelectorAll(".col-card, .lens-card, .stage-canvas").forEach((el) => {
        (el as HTMLElement).style.transform = "";
      });
    };

    // Attach hover sound to all interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest(".col-card") ||
          target.closest(".lens-card") ||
          target.closest(".swatch"))
      ) {
        soundFx.playHover();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Crimson Spotlight Ambient Aura */}
      <div
        className="crimson-spotlight-aura"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />

      {/* Cyber Reticle Cursor */}
      <div
        className={`cyber-custom-cursor ${isPointer ? "is-pointer" : ""}`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <div className="cursor-dot" />
        <div className="cursor-ring" />
      </div>
    </>
  );
}
