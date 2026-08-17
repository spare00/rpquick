import type { Filters } from "@/lib/queries";

const SELECT =
  "h-10 rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-ink";

export function FilterBar({ filters }: { filters: Filters }) {
  return (
    <form className="grid gap-3 rounded-2xl border border-line bg-card p-4 md:grid-cols-12 md:items-end">
      <label className="block text-xs text-muted md:col-span-2">
        보기
        <select name="view" defaultValue={filters.view ?? "hot"} className={`${SELECT} mt-1 w-full`}>
          <option value="hot">급매·저평가</option>
          <option value="drop">가격 하락</option>
          <option value="cheap">저평가</option>
          <option value="all">전체</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        주
        <select name="state" defaultValue={filters.state ?? ""} className={`${SELECT} mt-1 w-full`}>
          <option value="">전체</option>
          <option value="NSW">NSW</option>
          <option value="VIC">VIC</option>
          <option value="QLD">QLD</option>
          <option value="WA">WA</option>
          <option value="SA">SA</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        유형
        <select
          name="propertyType"
          defaultValue={filters.propertyType ?? ""}
          className={`${SELECT} mt-1 w-full`}
        >
          <option value="">전체</option>
          <option value="house">하우스</option>
          <option value="apartment">아파트</option>
          <option value="townhouse">타운하우스</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        침실
        <select name="beds" defaultValue={filters.beds ?? ""} className={`${SELECT} mt-1 w-full`}>
          <option value="">전체</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        정렬
        <select name="sort" defaultValue={filters.sort ?? "rank"} className={`${SELECT} mt-1 w-full`}>
          <option value="rank">종합 점수</option>
          <option value="drop">하락 점수</option>
          <option value="undervalue">저평가 점수</option>
          <option value="newest">최근 인하</option>
        </select>
      </label>
      <label className="block text-xs text-muted md:col-span-2">
        지역 검색
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
          필터 적용
        </button>
      </div>
    </form>
  );
}
