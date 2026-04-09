import { Sparkles, Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff2442] to-[#fb7299] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm text-neutral-500">
              &copy; {year} 小红书内容助手
            </p>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>用</span>
            <Heart className="w-4 h-4 text-[#ff2442] fill-[#ff2442]" />
            <span>和 AI 驱动创作</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-neutral-500 hover:text-[#ff2442] transition-colors"
            >
              隐私政策
            </a>
            <a
              href="#"
              className="text-neutral-500 hover:text-[#ff2442] transition-colors"
            >
              使用条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
