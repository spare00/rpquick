export default function MethodPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-rust uppercase">
        Ranking method
      </p>
      <h1 className="font-display text-4xl tracking-tight">점수는 이렇게 매깁니다</h1>
      <p className="mt-4 text-muted">
        Best Property는 호주 매물의 호가를 시간에 따라 쌓고, 같은 지역·같은 스펙의 다른 매물과
        비교합니다. 랭킹은 세 점수를 합친 종합 점수 순입니다.
      </p>

      <section className="mt-10 space-y-8 text-sm leading-7">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">1. 가격 하락 점수 (42%)</h2>
          <p className="mt-2 text-muted">
            7일·14일·30일 전 호가 대비 현재가 하락률을 봅니다. 짧은 기간의 큰 하락에 더 큰 가중치를
            줍니다. 10% / 7일이면 하락 점수 만점에 가깝고, 연속 인하가 있으면 가산합니다.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">2. 저평가 점수 (38%)</h2>
          <p className="mt-2 text-muted">
            같은 주 + 같은 서브럽 + 같은 유형 + 같은 침실 수의 현재 호가 중간값과 비교합니다.
            중간가보다 20% 낮으면 저평가 점수 만점입니다. 비교 매물이 3건 미만이면 신뢰도를 낮춥니다.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">3. 급매 신호 점수 (20%)</h2>
          <p className="mt-2 text-muted">
            매물 설명의 must sell, urgent, relocated, deceased estate 같은 키워드, 한 번에 5% 이상
            인하, 최근 7일 이내 인하, 장기 미판매를 합산합니다.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-lg font-semibold">데이터 출처</h2>
          <p className="mt-2 text-muted">
            기본은 시드 데이터로 UI와 스코어링을 바로 확인할 수 있습니다. 실제 수집은 Domain Group
            공식 API 키를 <code className="rounded bg-paper px-1">.env</code>에 넣고{" "}
            <code className="rounded bg-paper px-1">npm run ingest:domain</code> 을 실행하세요.
            realestate.com.au 는 공개 API가 없어 상세 화면에서 해당 지역 검색 링크를 제공합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
