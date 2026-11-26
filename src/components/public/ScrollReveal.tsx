"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const updateScreen = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateScreen();

    mediaQuery.addEventListener("change", updateScreen);

    return () => {
      mediaQuery.removeEventListener("change", updateScreen);
    };
  }, []);

  // Deteksi preferensi reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotionPreference = () => {
      setShouldReduceMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  // Observer untuk mendeteksi elemen ketika masuk viewport
  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (mediaQuery.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Pada mobile, seluruh animasi horizontal diubah menjadi vertikal
  const effectiveDirection = isMobile ? "up" : direction;

  const hiddenTransform = {
    up: "translate3d(0, 32px, 0)",
    left: "translate3d(-40px, 0, 0)",
    right: "translate3d(40px, 0, 0)",
  };

  const isRevealed = isVisible || shouldReduceMotion;

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? "translate3d(0, 0, 0)"
          : hiddenTransform[effectiveDirection],
        transition: shouldReduceMotion
          ? "none"
          : `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
        willChange: isRevealed ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}