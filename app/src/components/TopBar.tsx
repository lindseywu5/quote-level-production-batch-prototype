import Link from "next/link";

export function TopBar() {
  return (
    <>
      <div className="bg-blue-600 py-1.5 text-center text-xs text-white">
        Prototype · Quote-level Production Batches
      </div>
      <header className="flex items-center gap-5 border-b border-slate-200 bg-white px-6 py-2.5">
        <Link href="/" className="text-base font-extrabold tracking-tight text-slate-900">
          Xometry
        </Link>
        <div className="flex-1" />
        <nav className="hidden gap-4 text-[13px] text-slate-700 md:flex">
          <a className="hover:text-slate-900">Dashboard</a>
          <Link href="/" className="hover:text-slate-900">Quotes</Link>
          <a className="hover:text-slate-900">Orders</a>
          <a className="hover:text-slate-900">My Account ▾</a>
        </nav>
        <button className="rounded-md bg-blue-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-blue-700">
          Start a New Quote
        </button>
      </header>
    </>
  );
}
