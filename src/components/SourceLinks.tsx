import { ExternalLink, MapPin } from "lucide-react";

function withUtm(url: string, source: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "rpquick");
    parsed.searchParams.set("utm_medium", "referral");
    parsed.searchParams.set("utm_campaign", source);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function SourceLinks({
  domainUrl,
  reaUrl,
  address,
  suburb,
  state,
  lat,
  lng,
}: {
  domainUrl?: string | null;
  reaUrl?: string | null;
  address: string;
  suburb: string;
  state: string;
  lat?: number | null;
  lng?: number | null;
}) {
  const maps =
    lat != null && lng != null
      ? `https://maps.google.com/?q=${lat},${lng}`
      : `https://maps.google.com/?q=${encodeURIComponent(`${address}, ${suburb} ${state} Australia`)}`;

  const links = [
    { href: domainUrl ? withUtm(domainUrl, "domain") : domainUrl, label: "View on Domain" },
    { href: reaUrl ? withUtm(reaUrl, "rea") : reaUrl, label: "View on realestate.com.au" },
    { href: maps, label: "View on map", icon: true },
  ].filter((link) => Boolean(link.href));

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href!}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
        >
          {link.icon ? <MapPin size={16} /> : <ExternalLink size={16} />}
          {link.label}
        </a>
      ))}
    </div>
  );
}
