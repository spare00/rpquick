import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="group">
          <p className="font-display text-2xl tracking-tight">RP Quick</p>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            Rochedale · Rochedale South
          </p>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-rust">
            Rankings
          </Link>
          <Link href="/method" className="hover:text-rust">
            Method
          </Link>
        </nav>
      </div>
    </header>
  );
}
