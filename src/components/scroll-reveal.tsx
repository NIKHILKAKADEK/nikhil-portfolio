"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!targets.length || reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const observer = new IntersectionObserver((entries, currentObserver) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        currentObserver.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    try {
      targets.forEach((target) => observer.observe(target));
      root.classList.add("motion-ready");
    } catch {
      observer.disconnect();
      root.classList.remove("motion-ready");
      return;
    }

    const showEverything = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      observer.disconnect();
      root.classList.remove("motion-ready");
      targets.forEach((target) => target.classList.add("is-revealed"));
    };

    reducedMotion.addEventListener("change", showEverything);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", showEverything);
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
