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

The only reliable automated source is the [Domain developer API](https://developer.domain.com.au/).

1. Create a project and enable the **Agents & Listings** package (`api_listings_read`).
2. Put the API key in `.env` as `DOMAIN_API_KEY=...` (OAuth client ID/secret still work if you prefer).
3. Keep `DOMAIN_LOCATIONS=Rochedale,QLD;Rochedale South,QLD`.
4. Run:

```bash
npm run ingest:domain
```

If Domain returns `Operation not permitted on project`, the key is valid but that project does not have listing-search access yet. Add Agents & Listings on the project, then run ingest again.

The first pull has almost no price history, so drop scores stay low until you run ingest again on later days. Undervalue and distress keywords still work on day one.

## Scores

| Factor | Weight | What it measures |
| --- | --- | --- |
| Price drop | 42% | 7 / 14 / 30-day drop rates and consecutive cuts |
| Undervalue | 38% | Current ask vs the median for the same suburb, type, and beds |
| Distress signals | 20% | Distress keywords, a large single cut, a recent cut, long days on market |

Method page: `/method`
