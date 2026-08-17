import { ExternalLink, MapPin } from "lucide-react";

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
    { href: domainUrl, label: "Domain에서 보기" },
    { href: reaUrl, label: "realestate.com.au에서 보기" },
    { href: maps, label: "지도에서 위치 보기", icon: true },
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
