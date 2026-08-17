export default function MethodPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-rust uppercase">
        Ranking method
      </p>
      <h1 className="font-display text-4xl tracking-tight">How scores are calculated</h1>
      <p className="mt-4 text-muted">
        RP Quick tracks asking prices over time and compares each listing with others in
        Rochedale or Rochedale South with the same spec. Rankings follow the combined deal score.
      </p>

      <section className="mt-10 space-y-8 text-sm leading-7">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">1. Price-drop score (42%)</h2>
          <p className="mt-2 text-muted">
            We look at the asking-price drop versus 7, 14, and 30 days ago. Steeper short-term
            cuts weigh more. A 10% drop in 7 days is close to a full drop score, and consecutive
            cuts add extra points.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">2. Undervalue score (38%)</h2>
          <p className="mt-2 text-muted">
            We compare the current ask with the median of the same state, suburb, property type,
            and bedroom count. 20% below that median is a full undervalue score. Fewer than 3
            comps lowers confidence.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">3. Distress-signal score (20%)</h2>
          <p className="mt-2 text-muted">
            We add points for listing copy such as must sell, urgent, relocated, or deceased
            estate, a single cut of 5% or more, a cut in the last 7 days, and long days on
            market.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">Data sources</h2>
          <p className="mt-2 text-muted">
            Live listings come from the official Domain Group Agents & Listings API, scoped to
            Rochedale and Rochedale South only. Put the client ID and secret in{" "}
            <code className="rounded bg-paper px-1">.env</code> and run{" "}
            <code className="rounded bg-paper px-1">npm run ingest:domain</code>. The first pull
            stores the current ask; drop scores fill in after you run ingest again on later days.
            Domain and realestate.com.au public search pages block automated access, and REA has
            no public listings API — detail pages still link out to both sites.
          </p>
        </div>
      </section>
    </main>
  );
}
