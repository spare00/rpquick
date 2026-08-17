# RP Quick

A web app that ranks Australian listings by **distress likelihood** and **how far they sit below local comps**.

The home page leads with listings that look distressed or clearly underpriced. The detail page shows drop rates, the comparable median, rank reasons, and original Domain / realestate.com.au links.

## Run

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:setup` creates the SQLite schema and loads sample listings (with price history) across Sydney, Melbourne, Brisbane, Perth, and Adelaide.

## Live Domain collection

Get an Agents & Listings client ID and secret from the [Domain Developer Portal](https://developer.domain.com.au/), then add them to `.env`.

```
DOMAIN_CLIENT_ID=...
DOMAIN_CLIENT_SECRET=...
DOMAIN_LOCATIONS=Marrickville,NSW;Brunswick,VIC;West End,QLD
```

```bash
npm run ingest:domain
```

Re-ingesting the same listing appends a price snapshot when the ask has changed, then rescores the drop.

realestate.com.au has no public listings API. The REA link on the detail page goes to a suburb search.

## Scores

| Factor | Weight | What it measures |
| --- | --- | --- |
| Price drop | 42% | 7 / 14 / 30-day drop rates and consecutive cuts |
| Undervalue | 38% | Current ask vs the median for the same suburb, type, and beds |
| Distress signals | 20% | Distress keywords, a large single cut, a recent cut, long days on market |

Method page: `/method`
