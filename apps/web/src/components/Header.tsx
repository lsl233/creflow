import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Sparkles, Home, Calendar, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2442] to-[#fb7299] flex items-center justify-center shadow-lg shadow-[#ff2442]/20 group-hover:shadow-[#ff2442]/30 transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-900 leading-tight">小红书内容助手</span>
              <span className="text-[10px] text-neutral-400 leading-tight">AI 驱动的内容创作</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild className="text-neutral-600 hover:text-[#ff2442] hover:bg-[#ff2442]/5">
              <Link to="/" activeProps={{ className: 'text-[#ff2442] bg-[#ff2442]/10' }}>
                <Home className="mr-1.5 h-4 w-4" />
                首页
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-neutral-600 hover:text-[#ff2442] hover:bg-[#ff2442]/5">
              <Link to="/calendar" activeProps={{ className: 'text-[#ff2442] bg-[#ff2442]/10' }}>
                <Calendar className="mr-1.5 h-4 w-4" />
                日历
              </Link>
            </Button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-[#ff2442] to-[#fb7299] hover:from-[#e01f39] hover:to-[#e85f87] text-white shadow-md shadow-[#ff2442]/20"
            >
              <Link to="/">
                <Sparkles className="mr-1.5 h-4 w-4" />
                开始创作
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-neutral-600" />
            ) : (
              <Menu className="h-5 w-5 text-neutral-600" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-[#ff2442] transition-colors"
              >
                <Home className="h-4 w-4" />
                首页
              </Link>
              <Link
                to="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-[#ff2442] transition-colors"
              >
                <Calendar className="h-4 w-4" />
                日历
              </Link>
              <div className="pt-2 px-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#ff2442] to-[#fb7299] hover:from-[#e01f39] hover:to-[#e85f87] text-white"
                >
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    开始创作
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
