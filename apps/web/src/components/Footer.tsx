import { Sparkles, Heart, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-black/[0.06] bg-[#faf9f7]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dc2641] to-[#ff6b7a] flex items-center justify-center shadow-md shadow-[#dc2641]/15">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1a1a1a]">小红书内容助手</span>
              <p className="text-xs text-[#6b6b6b]">
                &copy; {year} All rights reserved
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
            <span>用</span>
            <Heart className="w-4 h-4 text-[#dc2641] fill-[#dc2641]" />
            <span>和 AI 驱动创作</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="group flex items-center gap-1 text-[#6b6b6b] hover:text-[#dc2641] transition-colors duration-200"
            >
              隐私政策
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
            </a>
            <a
              href="#"
              className="group flex items-center gap-1 text-[#6b6b6b] hover:text-[#dc2641] transition-colors duration-200"
            >
              使用条款
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
