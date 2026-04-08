import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, Lightbulb, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldExplanation {
  why: string
  impact: string
}

interface FormFieldWithExplanationProps {
  label: string
  required?: boolean
  explanation: FormFieldExplanation
  children: React.ReactNode
}

export function FormFieldWithExplanation({
  label,
  required,
  explanation,
  children,
}: FormFieldWithExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </Label>

      {children}

      {/* Explanation Toggle */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
      >
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
        />
        <span>{isExpanded ? '收起说明' : '为什么要设置此项？'}</span>
      </Button>

      {/* Explanation Content */}
      {isExpanded && (
        <Card className="border-none bg-muted/50">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs">
                  <Lightbulb className="h-3 w-3 text-primary" />
                </div>
                <div className="font-medium text-sm">为什么设置此项？</div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                {explanation.why}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs">
                  <BarChart3 className="h-3 w-3 text-primary" />
                </div>
                <div className="font-medium text-sm">设置后会有哪些影响？</div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                {explanation.impact}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
