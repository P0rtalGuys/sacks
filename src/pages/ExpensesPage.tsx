import { useState } from 'react'
import { Plus } from 'lucide-react'
import { getCurrentMonth, getMonthLabel } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useExpenses } from '@/hooks/useExpenses'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import type { Expense } from '@/types/expense'

export function ExpensesPage() {
  const fmt = useFormatCurrency()
  const month = getCurrentMonth()
  const { expenses, loading } = useExpenses(month)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            {getMonthLabel(month)} &middot; Total: <span className="text-foreground font-semibold">{fmt(total)}</span>
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onEdit={(e) => {
            setEditing(e)
            setFormOpen(true)
          }}
        />
      )}

      <ExpenseForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        expense={editing}
      />
    </div>
  )
}
