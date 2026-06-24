import { useState } from 'react'
import { Plus, PiggyBank } from 'lucide-react'
import { getCurrentMonth, getMonthLabel } from '@/lib/utils'
import { useBudgets } from '@/hooks/useBudgets'
import { useExpenses } from '@/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import { BudgetForm } from '@/components/budgets/BudgetForm'
import type { Budget } from '@/types/budget'

export function BudgetsPage() {
  const month = getCurrentMonth()
  const { budgets, loading } = useBudgets(month)
  const { expenses } = useExpenses(month)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)

  const spentByCategory: Record<string, number> = {}
  for (const e of expenses) {
    spentByCategory[e.category] = (spentByCategory[e.category] ?? 0) + e.amount
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">{getMonthLabel(month)}</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Set Budget
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <PiggyBank className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">No budgets set</p>
            <p className="text-sm mt-1">Set spending limits to stay on track this month</p>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-1 text-sm text-primary hover:underline font-medium cursor-pointer"
          >
            + Set your first budget
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={spentByCategory[budget.category] ?? 0}
              onEdit={(b) => {
                setEditing(b)
                setFormOpen(true)
              }}
            />
          ))}
        </div>
      )}

      <BudgetForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        month={month}
        budget={editing}
        existingCategories={budgets.map((b) => b.category)}
      />
    </div>
  )
}
