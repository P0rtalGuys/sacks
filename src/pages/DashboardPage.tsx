import { getCurrentMonth, getMonthLabel } from '@/lib/utils'
import { useExpenses } from '@/hooks/useExpenses'
import { useBudgets } from '@/hooks/useBudgets'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { getMonthlyAmount } from '@/services/subscriptions'
import { SpendingOverview } from '@/components/dashboard/SpendingOverview'
import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
import { RecentExpenses } from '@/components/dashboard/RecentExpenses'
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals'
import { MonthlyChart } from '@/components/dashboard/MonthlyChart'

export function DashboardPage() {
  const month = getCurrentMonth()
  const { expenses } = useExpenses(month)
  const { budgets } = useBudgets(month)
  const { subscriptions } = useSubscriptions()

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const subscriptionCost = subscriptions.reduce(
    (sum, s) => sum + getMonthlyAmount(s),
    0,
  )

  const spentByCategory: Record<string, number> = {}
  for (const e of expenses) {
    spentByCategory[e.category] = (spentByCategory[e.category] ?? 0) + e.amount
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{getMonthLabel(month)}</p>
        </div>
        <p className="text-xs text-muted-foreground/60 hidden sm:block pb-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <SpendingOverview
        totalSpent={totalSpent}
        totalBudget={totalBudget}
        subscriptionCost={subscriptionCost}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart expenses={expenses} />
        <BudgetProgress budgets={budgets} spentByCategory={spentByCategory} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentExpenses expenses={expenses} />
        <UpcomingRenewals subscriptions={subscriptions} />
      </div>
    </div>
  )
}
