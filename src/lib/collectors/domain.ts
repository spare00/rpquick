import type { NormalizedListing } from "../types";

type DomainToken = { access_token: string; expires_in: number };

type DomainSearchHit = {
  type?: string;
  listing?: {
    id?: number | string;
    listingSlug?: string;
    seoUrl?: string;
    headline?: string;
    summaryDescription?: string;
    description?: string;
    dateListed?: string;
    dateUpdated?: string;
    priceDetails?: {
      price?: number;
      displayPrice?: string;
      priceFrom?: number;
      priceTo?: number;
    };
    media?: { url?: string; category?: string }[];
    propertyDetails?: {
      propertyType?: string;
      bedrooms?: number;
      bathrooms?: number;
      carspaces?: number;
      landArea?: number;
      buildingArea?: number;
      displayableAddress?: string;
      streetNumber?: string;
      street?: string;
      suburb?: string;
      state?: string;
      postcode?: string;
      latitude?: number;
      longitude?: number;
      features?: string[];
    };
    advertiserIdentifiers?: { agentNames?: string[] };
    advertiser?: { name?: string };
  };
};

const TYPE_MAP: Record<string, string> = {
  House: "house",
  NewHouseLand: "house",
  ApartmentUnitFlat: "apartment",
  NewApartments: "apartment",
  Townhouse: "townhouse",
  Villa: "house",
  Terrace: "house",
};

function mapType(value?: string) {
  if (!value) return "house";
  return TYPE_MAP[value] ?? "house";
}

function listingPrice(listing: NonNullable<DomainSearchHit["listing"]>) {
  const details = listing.priceDetails;
  if (!details) return null;
  if (details.price && details.price > 0) return Math.round(details.price);
  if (details.priceFrom && details.priceTo) {
    return Math.round((details.priceFrom + details.priceTo) / 2);
  }
  if (details.priceFrom && details.priceFrom > 0) return Math.round(details.priceFrom);
  const digits = details.displayPrice?.replace(/[^0-9]/g, "");
  if (digits && digits.length >= 5) return Number(digits);
  return null;
}

function domainUrl(listing: NonNullable<DomainSearchHit["listing"]>) {
  if (listing.seoUrl) {
    return listing.seoUrl.startsWith("http")
      ? listing.seoUrl
      : `https://www.domain.com.au/${listing.seoUrl.replace(/^\//, "")}`;
  }
  if (listing.listingSlug) {
    return `https://www.domain.com.au/${listing.listingSlug}`;
  }
  return listing.id ? `https://www.domain.com.au/${listing.id}` : null;
}

function reaSearchUrl(suburb?: string, state?: string, postcode?: string) {
  if (!suburb || !state) return null;
  const q = postcode ? `${suburb}, ${state} ${postcode}` : `${suburb}, ${state}`;
  return `https://www.realestate.com.au/buy/in-${encodeURIComponent(q)}/list-1`;
}

async function getToken(clientId: string, clientSecret: string) {
  const response = await fetch("https://auth.domain.com.au/v1/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "api_listings_read",
    }),
  });
  if (!response.ok) {
    throw new Error(`Domain token failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as DomainToken;
}

function parseLocations(raw: string) {
  return raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [suburb, state] = part.split(",").map((s) => s.trim());
      return { suburb, state };
    })
    .filter((row) => row.suburb && row.state);
}

export async function collectDomainListings(options?: {
  clientId?: string;
  clientSecret?: string;
  locations?: string;
  pagesPerSuburb?: number;
}): Promise<NormalizedListing[]> {
  const clientId = options?.clientId ?? process.env.DOMAIN_CLIENT_ID ?? "";
  const clientSecret = options?.clientSecret ?? process.env.DOMAIN_CLIENT_SECRET ?? "";
  if (!clientId || !clientSecret) {
    throw new Error("DOMAIN_CLIENT_ID and DOMAIN_CLIENT_SECRET are required.");
  }

  const locations = parseLocations(
    options?.locations ?? process.env.DOMAIN_LOCATIONS ?? "Marrickville,NSW",
  );
  const pages = options?.pagesPerSuburb ?? 2;
  const token = await getToken(clientId, clientSecret);
  const now = new Date();
  const out: NormalizedListing[] = [];

  for (const location of locations) {
    for (let page = 1; page <= pages; page += 1) {
      const response = await fetch(
        "https://api.domain.com.au/v1/listings/residential/_search",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingType: "Sale",
            propertyTypes: ["House", "ApartmentUnitFlat", "Townhouse", "NewApartments"],
            locations: [
              {
                state: location.state,
                suburb: location.suburb,
                includeSurroundingSuburbs: false,
              },
            ],
            pageSize: 25,
            pageNumber: page,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Domain search failed (${location.suburb}): ${response.status} ${await response.text()}`,
        );
      }
      const hits = (await response.json()) as DomainSearchHit[];
      if (!Array.isArray(hits) || hits.length === 0) break;

      for (const hit of hits) {
        const listing = hit.listing;
        if (!listing?.id || !listing.propertyDetails) continue;
        const price = listingPrice(listing);
        if (!price) continue;
        const details = listing.propertyDetails;
        const listedAt = listing.dateListed ? new Date(listing.dateListed) : now;
        const image =
          listing.media?.find((m) => m.url)?.url ??
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

        out.push({
          source: "domain",
          sourceId: String(listing.id),
          domainUrl: domainUrl(listing),
          reaUrl: reaSearchUrl(details.suburb, details.state, details.postcode),
          address: details.displayableAddress ?? `${details.streetNumber ?? ""} ${details.street ?? ""}`.trim(),
          suburb: details.suburb ?? location.suburb,
          state: details.state ?? location.state,
          postcode: details.postcode ?? "",
          lat: details.latitude,
          lng: details.longitude,
          propertyType: mapType(details.propertyType),
          beds: details.bedrooms ?? 0,
          baths: details.bathrooms ?? 0,
          parking: details.carspaces ?? 0,
          landSqm: details.landArea ? Math.round(details.landArea) : null,
          floorSqm: details.buildingArea ? Math.round(details.buildingArea) : null,
          currentPrice: price,
          displayPrice: listing.priceDetails?.displayPrice ?? `$${price.toLocaleString("en-AU")}`,
          listedAt,
          lastSeenAt: now,
          headline: listing.headline ?? "",
          description: listing.description ?? listing.summaryDescription ?? "",
          imageUrl: image,
          agentName: listing.advertiserIdentifiers?.agentNames?.[0] ?? null,
          agencyName: listing.advertiser?.name ?? null,
          features: details.features ?? [],
          priceHistory: [{ price, recordedAt: listedAt }],
        });
      }

      await new Promise((r) => setTimeout(r, 400));
    }
  }

  return out;
}
