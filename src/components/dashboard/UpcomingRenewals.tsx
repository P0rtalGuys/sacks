import { AlertCircle } from 'lucide-react'
import { formatDate, getNameColor, getInitials } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Subscription } from '@/types/subscription'

interface Props {
  subscriptions: Subscription[]
}

export function UpcomingRenewals({ subscriptions }: Props) {
  const fmt = useFormatCurrency()
  const upcoming = subscriptions
    .filter((s) => {
      const days = Math.ceil(
        (s.nextRenewalDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
      return days <= 7 && days >= 0
    })
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-chart-4" />
          Upcoming Renewals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No renewals in the next 7 days</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((sub) => {
              const renewDate = sub.nextRenewalDate.toDate()
              const days = Math.ceil(
                (renewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              )
              return (
                <div key={sub.id} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ backgroundColor: getNameColor(sub.name) }}
                  >
                    {getInitials(sub.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                      {' '}&middot; {formatDate(renewDate)}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {fmt(sub.amount)}
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
