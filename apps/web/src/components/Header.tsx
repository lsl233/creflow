import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Sparkles, Home, Calendar, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#faf9f7]/85 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2641] to-[#ff6b7a] flex items-center justify-center shadow-lg shadow-[#dc2641]/20 group-hover:shadow-[#dc2641]/30 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#dc2641] to-[#ff6b7a] opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1a1a1a] leading-tight tracking-tight">小红书内容助手</span>
              <span className="text-[10px] text-[#6b6b6b] leading-tight font-medium">AI 驱动的内容创作</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#6b6b6b] hover:text-[#dc2641] hover:bg-[#dc2641]/5 rounded-full px-4 transition-all duration-300"
            >
              <Link to="/" activeProps={{ className: 'text-[#dc2641] bg-[#dc2641]/10' }}>
                <Home className="mr-1.5 h-4 w-4" />
                首页
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#6b6b6b] hover:text-[#dc2641] hover:bg-[#dc2641]/5 rounded-full px-4 transition-all duration-300"
            >
              <Link to="/setup" activeProps={{ className: 'text-[#dc2641] bg-[#dc2641]/10' }}>
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
              className="bg-linear-to-r from-[#dc2641] to-[#ff6b7a] hover:from-[#b91c36] hover:to-[#e85a68] rounded-full px-5 shadow-md shadow-[#dc2641]/20 btn-shine transition-all duration-300 hover:shadow-lg hover:shadow-[#dc2641]/30"
            >
              <Link to="/">
                <Sparkles className="mr-1.5 h-4 w-4 text-white" />
                <span className="text-white">开始创作</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl hover:bg-[#dc2641]/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-[#1a1a1a]" />
            ) : (
              <Menu className="h-5 w-5 text-[#1a1a1a]" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-black/[0.06] space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6b6b6b] hover:bg-[#dc2641]/5 hover:text-[#dc2641] transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              首页
            </Link>
            <Link
              to="/calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6b6b6b] hover:bg-[#dc2641]/5 hover:text-[#dc2641] transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              日历
            </Link>
            <div className="pt-2 px-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#dc2641] to-[#ff6b7a] hover:from-[#b91c36] hover:to-[#e85a68] text-white rounded-xl"
              >
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  开始创作
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
