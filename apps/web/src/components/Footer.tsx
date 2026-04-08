export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t px-4 pb-14 pt-10 text-muted-foreground">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} 小红书内容助手
        </p>
        <p className="text-xs font-semibold tracking-widest uppercase text-primary/80 m-0">AI 驱动的内容创作</p>
      </div>
    </footer>
  )
}
