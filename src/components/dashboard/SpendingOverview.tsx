import { TrendingDown, TrendingUp, Repeat2 } from 'lucide-react'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

interface Props {
  totalSpent: number
  totalBudget: number
  subscriptionCost: number
}

export function SpendingOverview({ totalSpent, totalBudget, subscriptionCost }: Props) {
  const fmt = useFormatCurrency()
  const remaining = totalBudget - totalSpent
  const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Primary stat — gradient hero card */}
      <div className="gradient-primary rounded-2xl p-6 shadow-lg shadow-primary/20 text-white">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-white/70">Total Spent</p>
          <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white/90" />
          </div>
        </div>
        <div className="text-4xl font-bold tracking-tight tabular-nums">{fmt(totalSpent)}</div>
        {totalBudget > 0 && (
          <p className="text-sm text-white/55 mt-2">
            {percentage}% of {fmt(totalBudget)} budget
          </p>
        )}
      </div>

      {/* Remaining */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Remaining</p>
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            remaining >= 0 ? 'bg-accent/10' : 'bg-destructive/10'
          }`}>
            {remaining >= 0
              ? <TrendingDown className="h-4 w-4 text-accent" />
              : <TrendingUp className="h-4 w-4 text-destructive" />
            }
          </div>
        </div>
        <div className={`text-4xl font-bold tracking-tight tabular-nums ${
          remaining < 0 ? 'text-destructive' : 'text-accent'
        }`}>
          {fmt(Math.abs(remaining))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {totalBudget === 0 ? 'No budget set' : remaining < 0 ? 'Over budget' : 'Under budget'}
        </p>
      </div>

      {/* Subscriptions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Subscriptions</p>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Repeat2 className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="text-4xl font-bold tracking-tight tabular-nums">{fmt(subscriptionCost)}</div>
        <p className="text-sm text-muted-foreground mt-2">Monthly recurring</p>
      </div>
    </div>
  )
}
