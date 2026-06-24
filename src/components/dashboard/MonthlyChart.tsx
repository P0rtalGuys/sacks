import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORIES } from '@/lib/categories'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense[]
}

export function MonthlyChart({ expenses }: Props) {
  const fmt = useFormatCurrency()
  const data = CATEGORIES.filter((cat) =>
    expenses.some((e) => e.category === cat.id),
  ).map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0)
    return {
      name: cat.label.split(' ')[0],
      amount: total / 100,
      fill: cat.color,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data to display</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v * 100)} />
              <Tooltip
                formatter={(value) => [fmt(Number(value) * 100), 'Spent']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
