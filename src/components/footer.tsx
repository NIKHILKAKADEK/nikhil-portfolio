import Link from "next/link";
import { portfolio } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-identity" data-reveal="left">
        <strong>{portfolio.personal.name}</strong>
        <span>{portfolio.footer.discipline}</span>
        <span className="footer-copyright">© {new Date().getFullYear()}</span>
      </div>
      <nav className="footer-navigation" data-reveal="right" aria-label={portfolio.footer.navigationLabel}>
        {portfolio.footer.navigation.map((link) => (
          <Link key={link.label} href={link.href}>{link.label}</Link>
        ))}
      </nav>
    </footer>
  );
}
