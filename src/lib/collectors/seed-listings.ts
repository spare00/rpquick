import { subDays } from "date-fns";
import type { NormalizedListing } from "../types";

const NOW = new Date("2026-08-17T02:00:00+10:00");

const HOUSE_PHOTOS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80",
];

const AGENCIES: [string, string][] = [
  ["Sarah Chen", "Ray White"],
  ["James Walsh", "McGrath"],
  ["Priya Nair", "Belle Property"],
  ["Tom Brennan", "LJ Hooker"],
];

function mulberry32(seed: number) {
  return function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function jitter(rng: () => number, base: number, spread: number) {
  return Math.round((base * (1 + (rng() * 2 - 1) * spread)) / 1000) * 1000;
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function domainUrl(address: string, suburb: string, state: string, postcode: string, id: string) {
  return `https://www.domain.com.au/${slug(`${address} ${suburb} ${state} ${postcode}`)}-${id}`;
}

function reaUrl(suburb: string, state: string, postcode: string) {
  return `https://www.realestate.com.au/buy/in-${encodeURIComponent(`${suburb}, ${state} ${postcode}`)}/list-1`;
}

type DealSpec = {
  street: string;
  number: string;
  vsMedian: number;
  history: [daysAgo: number, vsMedian: number][];
  headline: string;
  description: string;
  listedDaysAgo: number;
  landSqm?: number;
  floorSqm?: number;
};

type Cluster = {
  suburb: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  propertyType: "house" | "townhouse";
  beds: number;
  baths: number;
  parking: number;
  landSqm?: number;
  floorSqm?: number;
  median: number;
  streets: string[];
  deals: DealSpec[];
  compCount: number;
};

const CLUSTERS: Cluster[] = [
  {
    suburb: "Rochedale",
    state: "QLD",
    postcode: "4123",
    lat: -27.5754,
    lng: 153.1321,
    propertyType: "house",
    beds: 4,
    baths: 2,
    parking: 2,
    landSqm: 700,
    floorSqm: 240,
    median: 1_350_000,
    streets: ["Rochedale Road", "Miles Platting Road", "Priestdale Road", "Chelsea Road"],
    compCount: 3,
    deals: [
      {
        street: "Rochedale Road",
        number: "412",
        vsMedian: 0.84,
        listedDaysAgo: 38,
        landSqm: 680,
        history: [
          [38, 1.08],
          [16, 0.96],
          [5, 0.84],
        ],
        headline: "Urgent sale — family already relocated",
        description:
          "Must sell. Owners have relocated interstate and want a quick sale. Fourth-bedroom family home, recently reduced after sitting through two open weekends.",
      },
      {
        street: "Chelsea Road",
        number: "18",
        vsMedian: 0.88,
        listedDaysAgo: 24,
        landSqm: 720,
        history: [
          [24, 1.02],
          [8, 0.88],
        ],
        headline: "Price reduced — vendor wants sold",
        description:
          "Price reduced. Vendor wants sold before the next school term. Pool and north-facing yard, close to Rochedale State School.",
      },
    ],
  },
  {
    suburb: "Rochedale South",
    state: "QLD",
    postcode: "4123",
    lat: -27.5952,
    lng: 153.1234,
    propertyType: "house",
    beds: 3,
    baths: 2,
    parking: 2,
    landSqm: 600,
    floorSqm: 180,
    median: 1_120_000,
    streets: ["Underwood Road", "Gowan Road", "Allira Crescent", "Ford Road"],
    compCount: 3,
    deals: [
      {
        street: "Underwood Road",
        number: "91",
        vsMedian: 0.82,
        listedDaysAgo: 41,
        landSqm: 612,
        history: [
          [41, 1.1],
          [21, 0.97],
          [4, 0.82],
        ],
        headline: "Motivated vendor — deceased estate",
        description:
          "Deceased estate. Motivated vendor instructions to sell. Three-bed house walking distance to local shops, third price reduction.",
      },
      {
        street: "Gowan Road",
        number: "27",
        vsMedian: 0.87,
        listedDaysAgo: 19,
        landSqm: 580,
        history: [
          [19, 0.99],
          [6, 0.87],
        ],
        headline: "Quick sale wanted after unsuccessful auction",
        description:
          "Quick sale. Passed in at auction and now priced to sell. Updated kitchen, large backyard, close to parks and bus routes.",
      },
    ],
  },
];

function makeListing(
  cluster: Cluster,
  opts: {
    sourceId: string;
    street: string;
    number: string;
    price: number;
    history: { price: number; recordedAt: Date }[];
    headline: string;
    description: string;
    listedAt: Date;
    imageUrl: string;
    agent: [string, string];
    landSqm?: number;
    floorSqm?: number;
    lat: number;
    lng: number;
  },
): NormalizedListing {
  const address = `${opts.number} ${opts.street}`;
  return {
    source: "seed",
    sourceId: opts.sourceId,
    domainUrl: domainUrl(address, cluster.suburb, cluster.state, cluster.postcode, opts.sourceId),
    reaUrl: reaUrl(cluster.suburb, cluster.state, cluster.postcode),
    address,
    suburb: cluster.suburb,
    state: cluster.state,
    postcode: cluster.postcode,
    lat: opts.lat,
    lng: opts.lng,
    propertyType: cluster.propertyType,
    beds: cluster.beds,
    baths: cluster.baths,
    parking: cluster.parking,
    landSqm: opts.landSqm ?? cluster.landSqm ?? null,
    floorSqm: opts.floorSqm ?? cluster.floorSqm ?? null,
    currentPrice: opts.price,
    displayPrice: new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(opts.price),
    listedAt: opts.listedAt,
    lastSeenAt: NOW,
    headline: opts.headline,
    description: opts.description,
    imageUrl: opts.imageUrl,
    agentName: opts.agent[0],
    agencyName: opts.agent[1],
    features: ["North-facing yard", "Updated kitchen", "Near schools"],
    priceHistory: opts.history,
  };
}

export function buildSeedListings(now = NOW): NormalizedListing[] {
  const listings: NormalizedListing[] = [];

  CLUSTERS.forEach((cluster, clusterIndex) => {
    const rng = mulberry32(20260817 + clusterIndex * 97);

    cluster.deals.forEach((deal, dealIndex) => {
      const history = deal.history.map(([daysAgo, vs]) => ({
        recordedAt: subDays(now, daysAgo),
        price: Math.round((cluster.median * vs) / 1000) * 1000,
      }));
      const current = history[history.length - 1].price;
      listings.push(
        makeListing(cluster, {
          sourceId: `${cluster.state}-${slug(cluster.suburb)}-deal-${dealIndex + 1}`,
          street: deal.street,
          number: deal.number,
          price: current,
          history,
          headline: deal.headline,
          description: deal.description,
          listedAt: subDays(now, deal.listedDaysAgo),
          imageUrl: HOUSE_PHOTOS[dealIndex % HOUSE_PHOTOS.length],
          agent: AGENCIES[(clusterIndex + dealIndex) % AGENCIES.length],
          landSqm: deal.landSqm,
          floorSqm: deal.floorSqm,
          lat: cluster.lat + (rng() - 0.5) * 0.008,
          lng: cluster.lng + (rng() - 0.5) * 0.008,
        }),
      );
    });

    for (let i = 0; i < cluster.compCount; i += 1) {
      const street = cluster.streets[i % cluster.streets.length];
      const number = String(10 + Math.floor(rng() * 180));
      const listedDays = 12 + Math.floor(rng() * 40);
      const price = jitter(rng, cluster.median, 0.06);
      const listedAt = subDays(now, listedDays);
      listings.push(
        makeListing(cluster, {
          sourceId: `${cluster.state}-${slug(cluster.suburb)}-comp-${i + 1}`,
          street,
          number,
          price,
          history: [{ price, recordedAt: listedAt }],
          headline: `${cluster.beds} bed ${cluster.propertyType} in ${cluster.suburb}`,
          description: `Well presented ${cluster.beds}-bedroom ${cluster.propertyType} in ${cluster.suburb}. Close to shops, parks and schools. Currently priced in line with recent local sales.`,
          listedAt,
          imageUrl: HOUSE_PHOTOS[(i + 2) % HOUSE_PHOTOS.length],
          agent: AGENCIES[(clusterIndex + i + 2) % AGENCIES.length],
          lat: cluster.lat + (rng() - 0.5) * 0.01,
          lng: cluster.lng + (rng() - 0.5) * 0.01,
        }),
      );
    }
  });

  return listings;
}
