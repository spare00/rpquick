import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="group">
          <p className="font-display text-2xl tracking-tight">Best Property</p>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            급매 · 저평가 레이더
          </p>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-rust">
            랭킹
          </Link>
          <Link href="/method" className="hover:text-rust">
            산정 방식
          </Link>
        </nav>
      </div>
    </header>
  );
}
