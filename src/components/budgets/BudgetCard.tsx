import { Pencil, Trash2 } from 'lucide-react'
import { getCategoryById } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteBudget } from '@/services/budgets'
import type { Budget } from '@/types/budget'

interface Props {
  budget: Budget
  spent: number
  onEdit: (budget: Budget) => void
}

export function BudgetCard({ budget, spent, onEdit }: Props) {
  const fmt = useFormatCurrency()
  const cat = getCategoryById(budget.category)
  const percentage = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0
  const remaining = budget.limit - spent

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.color + '20' }}
            >
              <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
            </div>
            <div>
              <p className="font-medium">{cat.label}</p>
              <p className="text-sm text-muted-foreground">
                {fmt(spent)} of {fmt(budget.limit)}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteBudget(budget.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full progress-fill',
              percentage >= 90
                ? 'bg-destructive'
                : percentage >= 75
                  ? 'bg-chart-4'
                  : 'bg-accent',
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <span className="text-muted-foreground">{Math.round(percentage)}% used</span>
          <span
            className={cn(
              'font-medium',
              remaining < 0 ? 'text-destructive' : 'text-accent',
            )}
          >
            {remaining < 0 ? 'Over by ' : ''}
            {fmt(Math.abs(remaining))}
            {remaining >= 0 ? ' left' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
