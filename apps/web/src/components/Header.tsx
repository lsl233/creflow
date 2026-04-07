import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--xhs-primary)] no-underline shadow-[0_4px_12px_rgba(255,36,66,0.1)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#ff2442] to-[#fb7299]" />
            小红书内容助手
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-x-4 text-sm font-semibold sm:ml-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            首页
          </Link>
        </div>
      </nav>
    </header>
  )
}
