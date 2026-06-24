import { Pencil, Trash2 } from 'lucide-react'
import { deleteExpense } from '@/services/expenses'
import { getCategoryById } from '@/lib/categories'
import { formatDate } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { Button } from '@/components/ui/button'
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
}

export function ExpenseList({ expenses, onEdit }: Props) {
  const fmt = useFormatCurrency()

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No expenses yet</p>
        <p className="text-sm">Add your first expense to start tracking</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => {
        const cat = getCategoryById(expense.category)
        return (
          <div
            key={expense.id}
            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-secondary/80 transition-colors"
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: cat.color + '20' }}
            >
              <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {expense.description || cat.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {cat.label} &middot; {formatDate(expense.date.toDate())}
              </p>
            </div>
            <p className="font-semibold tabular-nums">
              {fmt(expense.amount)}
            </p>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteExpense(expense.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
