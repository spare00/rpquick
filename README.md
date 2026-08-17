# RP Quick

A web app that ranks **Rochedale** and **Rochedale South** listings by distress likelihood and how far they sit below local comps.

Coverage is limited to those two Brisbane suburbs on purpose so live ingest stays small enough to test.

## Run

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:setup` creates the SQLite schema and loads a small sample set for the two suburbs. Replace it with live Domain listings as soon as you have API keys.

## Live data

The only reliable automated source is the [Domain developer API](https://developer.domain.com.au/) (Agents & Listings, `api_listings_read`).

Public Domain and realestate.com.au search pages block bots (403 / 429). REA has no public listings API. Scraping those sites is not used here.

1. Create an app on the Domain Developer Portal and copy the client ID and secret into `.env`.
2. Keep `DOMAIN_LOCATIONS=Rochedale,QLD;Rochedale South,QLD`.
3. Run:

```bash
npm run ingest:domain
```

That wipes sample rows and stores current for-sale listings with a numeric price. The first pull has almost no price history, so drop scores stay low until you run ingest again on later days. Undervalue and distress keywords still work on day one.

## Scores

| Factor | Weight | What it measures |
| --- | --- | --- |
| Price drop | 42% | 7 / 14 / 30-day drop rates and consecutive cuts |
| Undervalue | 38% | Current ask vs the median for the same suburb, type, and beds |
| Distress signals | 20% | Distress keywords, a large single cut, a recent cut, long days on market |

Method page: `/method`
