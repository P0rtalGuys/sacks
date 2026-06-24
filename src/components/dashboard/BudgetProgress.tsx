import { getCategoryById } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Budget } from '@/types/budget'

interface Props {
  budgets: Budget[]
  spentByCategory: Record<string, number>
}

export function BudgetProgress({ budgets, spentByCategory }: Props) {
  const fmt = useFormatCurrency()

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No budgets set this month</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget) => {
          const cat = getCategoryById(budget.category)
          const spent = spentByCategory[budget.category] ?? 0
          const pct = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0

          return (
            <div key={budget.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <cat.icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                  {cat.label}
                </span>
                <span className="text-muted-foreground">
                  {fmt(spent)} / {fmt(budget.limit)}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full progress-fill',
                    pct >= 90 ? 'bg-destructive' : pct >= 75 ? 'bg-chart-4' : 'bg-accent',
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
