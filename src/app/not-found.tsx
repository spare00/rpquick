export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-display text-6xl">404</p>
      <p className="mt-3 text-muted">매물을 찾을 수 없습니다.</p>
      <a href="/" className="mt-6 inline-block text-sm font-medium text-rust">
        랭킹으로 돌아가기
      </a>
    </main>
  );
}
