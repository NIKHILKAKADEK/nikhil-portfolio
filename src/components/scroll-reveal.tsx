"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>(".project-feature")];
    const cards = [...document.querySelectorAll<HTMLElement>(".project-feature .project-copy")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const root = document.documentElement;

    if (!targets.length) return;

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries, currentObserver) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-revealed");
            currentObserver.unobserve(entry.target);
          }
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 })
      : undefined;

    const resetTilt = (card: HTMLElement) => {
      card.classList.remove("tilt-active");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    };
    const moveTilt = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 5}deg`);
      card.style.setProperty("--tilt-y", `${y * -5}deg`);
      card.classList.add("tilt-active");
    };
    const leaveTilt = (event: PointerEvent) => resetTilt(event.currentTarget as HTMLElement);
    const enableTilt = () => cards.forEach((card) => {
      card.addEventListener("pointermove", moveTilt);
      card.addEventListener("pointerleave", leaveTilt);
      card.addEventListener("pointercancel", leaveTilt);
    });
    const disableTilt = () => cards.forEach((card) => {
      card.removeEventListener("pointermove", moveTilt);
      card.removeEventListener("pointerleave", leaveTilt);
      card.removeEventListener("pointercancel", leaveTilt);
      resetTilt(card);
    });
    const syncMotion = () => {
      if (reducedMotion.matches) {
        observer?.disconnect();
        root.classList.remove("motion-ready");
        targets.forEach((target) => target.classList.add("is-revealed"));
        disableTilt();
        return;
      }

      if (observer) {
        root.classList.add("motion-ready");
        targets.forEach((target) => observer.observe(target));
      } else {
        targets.forEach((target) => target.classList.add("is-revealed"));
      }

      if (finePointer.matches) enableTilt();
      else disableTilt();
    };

    try {
      syncMotion();
    } catch {
      observer?.disconnect();
      disableTilt();
      root.classList.remove("motion-ready");
      return;
    }

    reducedMotion.addEventListener("change", syncMotion);
    finePointer.addEventListener("change", syncMotion);
    return () => {
      observer?.disconnect();
      disableTilt();
      reducedMotion.removeEventListener("change", syncMotion);
      finePointer.removeEventListener("change", syncMotion);
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
