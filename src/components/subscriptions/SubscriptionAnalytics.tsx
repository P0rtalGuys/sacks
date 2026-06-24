import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { getMonthlyAmount } from '@/services/subscriptions'
import { getCategoryById, CATEGORIES } from '@/lib/categories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Subscription } from '@/types/subscription'

interface Props {
  subscriptions: Subscription[]
  convert: (amountInCents: number, fromCurrency: string) => number
}

export function SubscriptionAnalytics({ subscriptions, convert }: Props) {
  const fmt = useFormatCurrency()

  function c(sub: Subscription, amount: number) {
    return convert(amount, sub.currency ?? 'USD')
  }

  const totalMonthly = subscriptions.reduce((sum, s) => sum + c(s, getMonthlyAmount(s)), 0)
  const totalYearly = totalMonthly * 12

  const categoryData = CATEGORIES.filter((cat) =>
    subscriptions.some((s) => s.category === cat.id),
  ).map((cat) => {
    const subs = subscriptions.filter((s) => s.category === cat.id)
    const total = subs.reduce((sum, s) => sum + c(s, getMonthlyAmount(s)), 0)
    return {
      name: cat.label,
      value: total / 100,
      color: cat.color,
      count: subs.length,
    }
  })

  const cycleData = [
    {
      name: 'Monthly',
      count: subscriptions.filter((s) => s.billingCycle === 'monthly').length,
      amount: subscriptions
        .filter((s) => s.billingCycle === 'monthly')
        .reduce((sum, s) => sum + c(s, s.amount), 0) / 100,
    },
    {
      name: 'Quarterly',
      count: subscriptions.filter((s) => s.billingCycle === 'quarterly').length,
      amount: subscriptions
        .filter((s) => s.billingCycle === 'quarterly')
        .reduce((sum, s) => sum + c(s, s.amount), 0) / 100,
    },
    {
      name: 'Yearly',
      count: subscriptions.filter((s) => s.billingCycle === 'yearly').length,
      amount: subscriptions
        .filter((s) => s.billingCycle === 'yearly')
        .reduce((sum, s) => sum + c(s, s.amount), 0) / 100,
    },
  ].filter((d) => d.count > 0)

  const costRanking = [...subscriptions]
    .sort((a, b) => c(b, getMonthlyAmount(b)) - c(a, getMonthlyAmount(a)))
    .slice(0, 5)

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No analytics to show</p>
        <p className="text-sm">Add subscriptions to see spending breakdowns</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{fmt(totalMonthly)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yearly Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{fmt(totalYearly)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{subscriptions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg per Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {fmt(subscriptions.length > 0 ? Math.round(totalMonthly / subscriptions.length) : 0)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [fmt(Math.round((value as number) * 100)), 'Monthly']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name} ({entry.count})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value) => [`$${(value as number).toFixed(2)}`, 'Per cycle']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                  }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 5 Most Expensive (Monthly)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {costRanking.map((sub, i) => {
            const cat = getCategoryById(sub.category)
            const monthly = c(sub, getMonthlyAmount(sub))
            const pct = totalMonthly > 0 ? (monthly / totalMonthly) * 100 : 0
            return (
              <div key={sub.id} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground w-5">{i + 1}</span>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sub.name}</p>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{fmt(monthly)}/mo</p>
                  <p className="text-xs text-muted-foreground">{pct.toFixed(0)}%</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
