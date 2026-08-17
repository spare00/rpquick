import { subDays } from "date-fns";
import type { NormalizedListing } from "../types";

const NOW = new Date("2026-08-17T02:00:00+10:00");

const HOUSE_PHOTOS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
];

const APT_PHOTOS = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24e4b77fee7?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
];

const AGENCIES: [string, string][] = [
  ["Sarah Chen", "Ray White"],
  ["James Walsh", "McGrath"],
  ["Priya Nair", "Belle Property"],
  ["Tom Brennan", "LJ Hooker"],
  ["Emily Park", "Barry Plant"],
  ["Daniel Cho", "Harcourts"],
];

function mulberry32(seed: number) {
  return function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: T[]) {
  return items[Math.floor(rng() * items.length)];
}

function jitter(rng: () => number, base: number, spread: number) {
  return Math.round(base * (1 + (rng() * 2 - 1) * spread) / 1000) * 1000;
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
  propertyType: "house" | "apartment" | "townhouse";
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
    suburb: "Marrickville",
    state: "NSW",
    postcode: "2204",
    lat: -33.9112,
    lng: 151.1554,
    propertyType: "house",
    beds: 3,
    baths: 2,
    parking: 1,
    landSqm: 280,
    floorSqm: 145,
    median: 1_680_000,
    streets: ["Illawarra Road", "Marrickville Road", "Livingstone Road", "Wardell Road", "Petersham Road"],
    compCount: 6,
    deals: [
      {
        street: "Illawarra Road",
        number: "214",
        vsMedian: 0.825,
        listedDaysAgo: 31,
        landSqm: 262,
        history: [
          [31, 1.14],
          [18, 1.06],
          [6, 0.96],
          [1, 0.825],
        ],
        headline: "Vendor relocated — must sell this week",
        description:
          "Third price reduction. The vendor has relocated to Singapore and must sell this week. Classic 3-bedroom terrace close to Marrickville station, original details with an updated kitchen. Motivated vendor, inspection by appointment.",
      },
      {
        street: "Wardell Road",
        number: "9",
        vsMedian: 0.9,
        listedDaysAgo: 44,
        landSqm: 248,
        history: [
          [44, 1.02],
          [12, 0.9],
        ],
        headline: "Price reduced for a quick sale",
        description:
          "Price reduced for a quick sale. Light-filled terrace on Wardell Road with north-facing backyard. The owners have bought elsewhere and want this sold before settlement.",
      },
    ],
  },
  {
    suburb: "Parramatta",
    state: "NSW",
    postcode: "2150",
    lat: -33.815,
    lng: 151.0011,
    propertyType: "apartment",
    beds: 2,
    baths: 2,
    parking: 1,
    floorSqm: 88,
    median: 740_000,
    streets: ["Church Street", "George Street", "Macquarie Street", "Phillip Street", "Hassall Street"],
    compCount: 6,
    deals: [
      {
        street: "Church Street",
        number: "88/12",
        vsMedian: 0.78,
        listedDaysAgo: 22,
        floorSqm: 86,
        history: [
          [22, 0.97],
          [9, 0.88],
          [3, 0.78],
        ],
        headline: "Urgent sale — riverfront two-bed",
        description:
          "Urgent sale. Investor exiting after rate pressure. Two-bed apartment near Parramatta River with city views. Must be sold this month. Second price reduction in two weeks.",
      },
    ],
  },
  {
    suburb: "Penrith",
    state: "NSW",
    postcode: "2750",
    lat: -33.7511,
    lng: 150.6942,
    propertyType: "house",
    beds: 4,
    baths: 2,
    parking: 2,
    landSqm: 620,
    floorSqm: 210,
    median: 1_050_000,
    streets: ["High Street", "Castlereagh Street", "Lethbridge Street", "Doone Street", "Coreen Avenue"],
    compCount: 6,
    deals: [
      {
        street: "Lethbridge Street",
        number: "42",
        vsMedian: 0.84,
        listedDaysAgo: 38,
        landSqm: 650,
        history: [
          [38, 1.05],
          [15, 0.95],
          [4, 0.84],
        ],
        headline: "Deceased estate — priced to sell",
        description:
          "Deceased estate. Family wants a clean sale. Four-bedroom brick home on a 650sqm block, walking distance to Penrith station. Priced well below recent suburb sales for a quick campaign.",
      },
    ],
  },
  {
    suburb: "Bondi",
    state: "NSW",
    postcode: "2026",
    lat: -33.8915,
    lng: 151.2767,
    propertyType: "apartment",
    beds: 2,
    baths: 1,
    parking: 1,
    floorSqm: 72,
    median: 1_450_000,
    streets: ["Campbell Parade", "Hall Street", "Gould Street", "Wairoa Avenue", "O'Brien Street"],
    compCount: 5,
    deals: [
      {
        street: "Gould Street",
        number: "5/18",
        vsMedian: 0.88,
        listedDaysAgo: 19,
        floorSqm: 70,
        history: [
          [19, 1.0],
          [5, 0.88],
        ],
        headline: "Beachside two-bed, vendor wants sold",
        description:
          "Vendor wants sold before spring. Two-bedroom apartment a short walk to Bondi Beach. Price reduced after a quiet first campaign. North-facing balcony, lock-up garage.",
      },
    ],
  },
  {
    suburb: "Brunswick",
    state: "VIC",
    postcode: "3056",
    lat: -37.7665,
    lng: 144.9617,
    propertyType: "apartment",
    beds: 2,
    baths: 1,
    parking: 1,
    floorSqm: 68,
    median: 620_000,
    streets: ["Sydney Road", "Lygon Street", "Albert Street", "Barkly Street", "Glenlyon Road"],
    compCount: 6,
    deals: [
      {
        street: "Sydney Road",
        number: "3/410",
        vsMedian: 0.81,
        listedDaysAgo: 27,
        floorSqm: 66,
        history: [
          [27, 0.98],
          [11, 0.9],
          [2, 0.81],
        ],
        headline: "Must sell — owner already interstate",
        description:
          "Owner already relocated interstate. Must sell. Warehouse-style two-bed on Sydney Road, tram at the door. Third inspection campaign, price now sharply reduced for a quick sale.",
      },
    ],
  },
  {
    suburb: "Richmond",
    state: "VIC",
    postcode: "3121",
    lat: -37.8183,
    lng: 145.0021,
    propertyType: "house",
    beds: 3,
    baths: 2,
    parking: 1,
    landSqm: 220,
    floorSqm: 132,
    median: 1_520_000,
    streets: ["Church Street", "Bridge Road", "Coppin Street", "Mary Street", "Docker Street"],
    compCount: 6,
    deals: [
      {
        street: "Coppin Street",
        number: "118",
        vsMedian: 0.87,
        listedDaysAgo: 41,
        landSqm: 208,
        history: [
          [41, 1.04],
          [8, 0.87],
        ],
        headline: "Victorian terrace, motivated vendor",
        description:
          "Motivated vendor has purchased in the Yarra Valley. Restored 3-bedroom Victorian terrace near Bridge Road. Substantial price reduction after 5 weeks on market.",
      },
    ],
  },
  {
    suburb: "Footscray",
    state: "VIC",
    postcode: "3011",
    lat: -37.7997,
    lng: 144.8996,
    propertyType: "house",
    beds: 3,
    baths: 1,
    parking: 1,
    landSqm: 360,
    floorSqm: 118,
    median: 890_000,
    streets: ["Barkly Street", "Nicholson Street", "Hyde Street", "Essex Street", "Moore Street"],
    compCount: 6,
    deals: [
      {
        street: "Essex Street",
        number: "27",
        vsMedian: 0.83,
        listedDaysAgo: 16,
        landSqm: 342,
        history: [
          [16, 0.99],
          [4, 0.83],
        ],
        headline: "Weatherboard on 342sqm — urgent sale",
        description:
          "Urgent sale due to job transfer. Charming weatherboard, 3 bedrooms, large backyard, walk to Footscray Market. First reduction is aggressive — vendor wants offers this week.",
      },
    ],
  },
  {
    suburb: "West End",
    state: "QLD",
    postcode: "4101",
    lat: -27.481,
    lng: 153.0095,
    propertyType: "apartment",
    beds: 2,
    baths: 2,
    parking: 1,
    floorSqm: 82,
    median: 710_000,
    streets: ["Boundary Street", "Hardgrave Road", "Mollison Street", "Vulture Street", "Jane Street"],
    compCount: 5,
    deals: [
      {
        street: "Boundary Street",
        number: "11/90",
        vsMedian: 0.8,
        listedDaysAgo: 24,
        floorSqm: 84,
        history: [
          [24, 0.96],
          [7, 0.8],
        ],
        headline: "River-side two-bed, price reduced",
        description:
          "Price reduced after a quiet auction campaign. Two-bed apartment near Boundary Street cafes. Vendor has bought in Sunshine Coast and needs a simultaneous settlement.",
      },
    ],
  },
  {
    suburb: "Chermside",
    state: "QLD",
    postcode: "4032",
    lat: -27.3847,
    lng: 153.0306,
    propertyType: "house",
    beds: 3,
    baths: 2,
    parking: 2,
    landSqm: 580,
    floorSqm: 168,
    median: 920_000,
    streets: ["Gympie Road", "Hamilton Road", "Playfield Street", "Banfield Street", "Kittyhawk Drive"],
    compCount: 6,
    deals: [
      {
        street: "Banfield Street",
        number: "15",
        vsMedian: 0.86,
        listedDaysAgo: 33,
        landSqm: 607,
        history: [
          [33, 1.03],
          [14, 0.94],
          [5, 0.86],
        ],
        headline: "Family home, multiple reductions",
        description:
          "Multiple reductions. Low-set 3-bed near Westfield Chermside. Owners are downsizing and have already moved. Priced below recent comparable sales on Banfield and Playfield.",
      },
    ],
  },
  {
    suburb: "New Farm",
    state: "QLD",
    postcode: "4005",
    lat: -27.4673,
    lng: 153.0485,
    propertyType: "apartment",
    beds: 2,
    baths: 2,
    parking: 1,
    floorSqm: 90,
    median: 890_000,
    streets: ["Brunswick Street", "Merthyr Road", "Moreton Street", "Sydney Street", "Moray Street"],
    compCount: 5,
    deals: [
      {
        street: "Moray Street",
        number: "6/44",
        vsMedian: 0.89,
        listedDaysAgo: 48,
        floorSqm: 88,
        history: [
          [48, 1.01],
          [20, 0.95],
          [6, 0.89],
        ],
        headline: "Art-deco two-bed, long campaign",
        description:
          "On market 7 weeks. Art-deco building, high ceilings, leafy Moray Street. Vendor wants sold before they relocate to Melbourne. Price now sitting under the New Farm two-bed median.",
      },
    ],
  },
  {
    suburb: "Fremantle",
    state: "WA",
    postcode: "6160",
    lat: -32.0569,
    lng: 115.7439,
    propertyType: "house",
    beds: 3,
    baths: 2,
    parking: 1,
    landSqm: 410,
    floorSqm: 140,
    median: 980_000,
    streets: ["South Terrace", "High Street", "Wray Avenue", "Attfield Street", "Hampton Road"],
    compCount: 5,
    deals: [
      {
        street: "Attfield Street",
        number: "31",
        vsMedian: 0.82,
        listedDaysAgo: 21,
        landSqm: 398,
        history: [
          [21, 1.0],
          [8, 0.91],
          [2, 0.82],
        ],
        headline: "Limestone cottage — must be sold",
        description:
          "Must be sold. Character limestone cottage a stroll to South Terrace. Vendor accepted a job in Sydney. Two reductions in three weeks, now clearly under the Fremantle 3-bed median.",
      },
    ],
  },
  {
    suburb: "Joondalup",
    state: "WA",
    postcode: "6027",
    lat: -31.745,
    lng: 115.766,
    propertyType: "house",
    beds: 4,
    baths: 2,
    parking: 2,
    landSqm: 540,
    floorSqm: 195,
    median: 780_000,
    streets: ["Grand Boulevard", "Collier Pass", "Lakeside Drive", "Barron Parade", "Shenton Avenue"],
    compCount: 6,
    deals: [
      {
        street: "Barron Parade",
        number: "8",
        vsMedian: 0.85,
        listedDaysAgo: 29,
        landSqm: 552,
        history: [
          [29, 1.02],
          [10, 0.85],
        ],
        headline: "Four-bed near lake, price reduced",
        description:
          "Price reduced for a quick sale. Four-bedroom family home near Lake Joondalup and the train line. Owners are relocating to Queensland for family reasons.",
      },
    ],
  },
  {
    suburb: "Norwood",
    state: "SA",
    postcode: "5067",
    lat: -34.921,
    lng: 138.634,
    propertyType: "house",
    beds: 3,
    baths: 1,
    parking: 1,
    landSqm: 320,
    floorSqm: 125,
    median: 1_050_000,
    streets: ["The Parade", "William Street", "Queen Street", "Beulah Road", "Osmond Terrace"],
    compCount: 5,
    deals: [
      {
        street: "Queen Street",
        number: "22",
        vsMedian: 0.86,
        listedDaysAgo: 36,
        landSqm: 305,
        history: [
          [36, 1.04],
          [13, 0.93],
          [3, 0.86],
        ],
        headline: "Bluestone cottage, motivated vendor",
        description:
          "Motivated vendor. Bluestone cottage on Queen Street, walk to The Parade. Third week of a reduced price after an unsuccessful auction. Deceased estate instructions to sell.",
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
    features: cluster.propertyType === "apartment"
      ? ["Secure building", "Air conditioning", "Close to transport"]
      : ["North-facing yard", "Updated kitchen", "Near schools"],
    priceHistory: opts.history,
  };
}

export function buildSeedListings(now = NOW): NormalizedListing[] {
  const listings: NormalizedListing[] = [];
  const photos = (type: Cluster["propertyType"]) =>
    type === "apartment" ? APT_PHOTOS : HOUSE_PHOTOS;

  CLUSTERS.forEach((cluster, clusterIndex) => {
    const rng = mulberry32(20260817 + clusterIndex * 97);
    const imagePool = photos(cluster.propertyType);

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
          imageUrl: imagePool[dealIndex % imagePool.length],
          agent: AGENCIES[(clusterIndex + dealIndex) % AGENCIES.length],
          landSqm: deal.landSqm,
          floorSqm: deal.floorSqm,
          lat: cluster.lat + (rng() - 0.5) * 0.01,
          lng: cluster.lng + (rng() - 0.5) * 0.01,
        }),
      );
    });

    for (let i = 0; i < cluster.compCount; i += 1) {
      const street = cluster.streets[i % cluster.streets.length];
      const number = String(10 + Math.floor(rng() * 180));
      const listedDays = 12 + Math.floor(rng() * 50);
      const price = jitter(rng, cluster.median, 0.06);
      const listedAt = subDays(now, listedDays);
      listings.push(
        makeListing(cluster, {
          sourceId: `${cluster.state}-${slug(cluster.suburb)}-comp-${i + 1}`,
          street,
          number: cluster.propertyType === "apartment" ? `${1 + (i % 12)}/${number}` : number,
          price,
          history: [{ price, recordedAt: listedAt }],
          headline: `${cluster.beds} bed ${cluster.propertyType} in ${cluster.suburb}`,
          description: `Well presented ${cluster.beds}-bedroom ${cluster.propertyType} in ${cluster.suburb}. Close to shops, parks and public transport. Currently priced in line with recent local sales.`,
          listedAt,
          imageUrl: imagePool[(i + 2) % imagePool.length],
          agent: AGENCIES[(clusterIndex + i + 2) % AGENCIES.length],
          lat: cluster.lat + (rng() - 0.5) * 0.012,
          lng: cluster.lng + (rng() - 0.5) * 0.012,
        }),
      );
    }
  });

  return listings;
}
