import { useState } from 'react'
import { Target, Pencil, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SubscriptionSettings } from '@/types/subscription'

interface Props {
  totalMonthly: number
  settings: SubscriptionSettings
  onUpdateSettings: (patch: Partial<SubscriptionSettings>) => void
}

export function SubscriptionBudgetCard({ totalMonthly, settings, onUpdateSettings }: Props) {
  const fmt = useFormatCurrency()
  const [editing, setEditing] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  const budget = settings.monthlyBudget
  const pct = budget > 0 ? Math.min((totalMonthly / budget) * 100, 100) : 0
  const remaining = budget - totalMonthly
  const isOver = remaining < 0
  const isWarning = pct >= 75 && pct < 90
  const isDanger = pct >= 90

  function startEdit() {
    setBudgetInput(budget > 0 ? String(budget / 100) : '')
    setEditing(true)
  }

  function saveEdit() {
    const value = parseFloat(budgetInput)
    if (!isNaN(value) && value >= 0) {
      onUpdateSettings({ monthlyBudget: Math.round(value * 100) })
    }
    setEditing(false)
  }

  if (budget === 0 && !editing) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <Target className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Set a subscription budget</p>
            <p className="text-sm text-muted-foreground">
              Track your monthly subscription spending against a limit
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={startEdit}>
            Set Budget
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4" />
          Monthly Budget
        </CardTitle>
        {!editing && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={startEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="e.g. 100"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              className="h-8"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={saveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-semibold">{fmt(totalMonthly)}</span>
              <span className="text-sm text-muted-foreground">of {fmt(budget)}</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full progress-fill',
                  isDanger ? 'bg-destructive' : isWarning ? 'bg-chart-4' : 'bg-accent',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className={cn(isOver ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                {isOver ? `${fmt(Math.abs(remaining))} over budget` : `${fmt(remaining)} remaining`}
              </span>
              <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
