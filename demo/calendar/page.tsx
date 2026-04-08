import { Suspense } from "react";
import { CalendarView } from "@/components/calendar-view";
import { Loader2 } from "lucide-react";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#ff2442]">Your Content Calendar</h1>
          <p className="text-muted-foreground">Review your 7-day plan and generate posts.</p>
        </header>
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-[#ff2442]" /></div>}>
          <CalendarView />
        </Suspense>
      </div>
    </main>
  );
}
