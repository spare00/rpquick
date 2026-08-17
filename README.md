# Best Property

호주 매물의 **급매 가능성**과 **지역·스펙 평균 대비 저평가**를 점수로 매겨 랭킹으로 보여주는 웹앱입니다.

메인 화면은 급매 확실성이 높거나 많이 저평가된 매물 위주로 정렬합니다. 상세 화면에서는 하락률, 비교 중간가, 선정 사유, 그리고 Domain / realestate.com.au 원문 링크를 제공합니다.

## 실행

```bash
npm install
npm run db:setup
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

`db:setup` 은 SQLite 스키마를 만들고, 시드니·멜번·브리즈번·퍼스·애들레이드 샘플 매물(가격 히스토리 포함)을 넣습니다.

## 실제 Domain 매물 수집

[Domain Developer Portal](https://developer.domain.com.au/) 에서 Agents & Listings 권한의 클라이언트 ID/시크릿을 발급받은 뒤 `.env`에 넣습니다.

```
DOMAIN_CLIENT_ID=...
DOMAIN_CLIENT_SECRET=...
DOMAIN_LOCATIONS=Marrickville,NSW;Brunswick,VIC;West End,QLD
```

```bash
npm run ingest:domain
```

같은 매물을 다시 수집하면 호가가 바뀐 경우 가격 스냅샷이 쌓이고, 하락 점수가 다시 계산됩니다.

realestate.com.au 는 공개 리스팅 API가 없습니다. 상세 화면의 REA 링크는 해당 서브럽 검색으로 연결됩니다.

## 점수

| 항목 | 비중 | 내용 |
| --- | --- | --- |
| 가격 하락 | 42% | 7/14/30일 하락률, 연속 인하 |
| 저평가 | 38% | 같은 지역·유형·침실 수 중간가 대비 |
| 급매 신호 | 20% | 급매 키워드, 큰 단일 인하, 최근 인하, 장기 미판매 |

산정 방식 페이지: `/method`
