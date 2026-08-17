import type { Filters } from "@/lib/queries";

const SELECT =
  "h-10 rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-ink";

export function FilterBar({ filters }: { filters: Filters }) {
  return (
    <form className="grid gap-3 rounded-2xl border border-line bg-card p-4 md:grid-cols-12 md:items-end">
      <label className="block text-xs text-muted md:col-span-2">
        View
        <select name="view" defaultValue={filters.view ?? "hot"} className={`${SELECT} mt-1 w-full`}>
          <option value="hot">Distressed & cheap</option>
          <option value="drop">Price drops</option>
          <option value="cheap">Undervalued</option>
          <option value="all">All</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        State
        <select name="state" defaultValue={filters.state ?? ""} className={`${SELECT} mt-1 w-full`}>
          <option value="">All</option>
          <option value="NSW">NSW</option>
          <option value="VIC">VIC</option>
          <option value="QLD">QLD</option>
          <option value="WA">WA</option>
          <option value="SA">SA</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        Type
        <select
          name="propertyType"
          defaultValue={filters.propertyType ?? ""}
          className={`${SELECT} mt-1 w-full`}
        >
          <option value="">All</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        Beds
        <select name="beds" defaultValue={filters.beds ?? ""} className={`${SELECT} mt-1 w-full`}>
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        Sort
        <select name="sort" defaultValue={filters.sort ?? "rank"} className={`${SELECT} mt-1 w-full`}>
          <option value="rank">Deal score</option>
          <option value="drop">Drop score</option>
          <option value="undervalue">Undervalue score</option>
          <option value="newest">Latest cut</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        Suburb search
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Marrickville"
          className={`${SELECT} mt-1 w-full`}
        />
      </label>
      <div className="md:col-span-12 flex justify-end">
        <button
          type="submit"
          className="h-10 rounded-md bg-ink px-5 text-sm font-medium text-paper hover:bg-ink/90"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}
