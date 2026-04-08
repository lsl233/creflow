import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1.5 text-sm text-primary no-underline shadow-sm sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-400" />
            小红书内容助手
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-x-4 text-sm font-semibold sm:ml-0">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
              activeProps={{ className: 'text-foreground' }}
            >
              首页
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
