// URL-bearing SEO fields must never fall back to Next.js's local server URL.
export function getSiteUrl(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return undefined;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be the real public HTTPS origin.");
  }
  const host = url.hostname;
  const placeholder = /(^|\.)(localhost|local|test|invalid|example)$/.test(host)
    || /(^|\.)example\.(com|net|org)$/.test(host);
  if (url.protocol !== "https:" || !host.includes(".") || placeholder
    || /^[\d.]+$/.test(host) || host.includes(":") || url.port
    || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be the real public HTTPS origin, without a path, port, query or credentials.");
  }
  return url;
}
