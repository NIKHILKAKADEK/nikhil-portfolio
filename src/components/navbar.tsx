"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ResumeLink } from "@/components/resume-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { portfolio } from "@/data/portfolio";

const navItems = portfolio.navigation;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame = 0;
    const updateScrolled = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        header.dataset.scrolled = String(window.scrollY > 8);
        frame = 0;
      });
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    const sections = navItems
      .filter((item): item is typeof item & { href: string } => Boolean(item.href))
      .map((item) => ({ href: item.href, section: document.querySelector<HTMLElement>(item.href) }))
      .filter((item): item is { href: string; section: HTMLElement } => item.section !== null);

    if (!("IntersectionObserver" in window)) {
      return () => {
        window.removeEventListener("scroll", updateScrolled);
        window.cancelAnimationFrame(frame);
      };
    }

    const visibility = new Map<string, number>();
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const href = `#${entry.target.id}`;
        visibility.set(href, entry.isIntersecting ? entry.intersectionRatio : 0);
      }
      const current = [...visibility.entries()].filter(([, ratio]) => ratio > 0).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
      setActiveHref(current);
    }, { rootMargin: "-20% 0px -68% 0px", threshold: [0, 0.15, 0.4, 0.7] });

    sections.forEach(({ section }) => sectionObserver.observe(section));
    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.cancelAnimationFrame(frame);
      sectionObserver.disconnect();
    };
  }, []);

  function closeMenu() {
    setOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }

  function navigateToSection(href: string) {
    setOpen(false);
    requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(href);
      const heading = section?.querySelector<HTMLElement>("h1, h2, h3") ?? section;
      if (!heading) return;
      const previousTabIndex = heading.getAttribute("tabindex");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.addEventListener("blur", () => {
        if (previousTabIndex === null) heading.removeAttribute("tabindex");
        else heading.setAttribute("tabindex", previousTabIndex);
      }, { once: true });
    });
  }

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    }

    function dismissOutside(event: Event) {
      const target = event.target;
      if (target instanceof Node && !menuRef.current?.contains(target) && !toggleRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    const desktop = window.matchMedia("(min-width: 761px)");
    function dismissOnDesktop() {
      if (!desktop.matches) return;
      if (menuRef.current?.contains(document.activeElement)) {
        headerRef.current?.querySelector<HTMLAnchorElement>(".nav-link")?.focus({ preventScroll: true });
      }
      setOpen(false);
    }

    document.addEventListener("keydown", dismissOnEscape);
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    desktop.addEventListener("change", dismissOnDesktop);
    return () => {
      document.removeEventListener("keydown", dismissOnEscape);
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      desktop.removeEventListener("change", dismissOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="nav-brand" href="#top" onClick={() => setOpen(false)} aria-label="Nikhil, home">
          {portfolio.personal.shortName}<span className="nav-brand-period">.</span>
        </a>

        <div className="nav-links" role="group" aria-label="Portfolio sections">
          {navItems.map((item) => item.href ? (
            <a className="nav-link" href={item.href} key={item.label} aria-current={activeHref === item.href ? "location" : undefined}>{item.label}</a>
          ) : (
            <span className="nav-link nav-link-pending" key={item.label} aria-disabled="true" title={`${item.label} section coming in a later module`}>
              {item.label}
            </span>
          ))}
        </div>

        <div className="nav-actions">
          <ResumeLink className="nav-resume" variant="secondary" />
          <button
            ref={toggleRef}
            className="mobile-menu-toggle"
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <div className={`mobile-nav${open ? " is-open" : ""}`} id="mobile-navigation" ref={menuRef} role="navigation" aria-label="Mobile navigation" aria-hidden={!open} inert={!open}>
          {navItems.map((item) => item.href ? (
            <a className="mobile-nav-link" href={item.href} key={item.label} aria-current={activeHref === item.href ? "location" : undefined} onClick={() => navigateToSection(item.href)}>{item.label}</a>
          ) : (
            <span className="mobile-nav-link nav-link-pending" key={item.label} aria-disabled="true">
              {item.label}
            </span>
          ))}
          <ResumeLink variant="secondary" onClick={closeMenu} />
      </div>
    </header>
  );
}
