import { getCategoryById } from '@/lib/categories'
import { formatDate } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: Props) {
  const fmt = useFormatCurrency()
  const recent = expenses.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expenses yet</p>
        ) : (
          <div className="space-y-3">
            {recent.map((expense) => {
              const cat = getCategoryById(expense.category)
              return (
                <div key={expense.id} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {expense.description || cat.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(expense.date.toDate())}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {fmt(expense.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
