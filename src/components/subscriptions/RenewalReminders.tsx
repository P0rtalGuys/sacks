import { Bell, AlertTriangle, Calendar } from 'lucide-react'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { getCategoryById } from '@/lib/categories'
import { getUpcomingRenewals } from '@/services/subscriptions'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Subscription, SubscriptionSettings } from '@/types/subscription'

interface Props {
  subscriptions: Subscription[]
  settings: SubscriptionSettings
  onUpdateSettings: (patch: Partial<SubscriptionSettings>) => void
}

export function RenewalReminders({ subscriptions, settings, onUpdateSettings }: Props) {
  const fmt = useFormatCurrency()
  const upcoming = getUpcomingRenewals(subscriptions, settings.reminderDaysBefore)

  const todayRenewals = upcoming.filter((s) => {
    const days = Math.ceil(
      (s.nextRenewalDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )
    return days <= 0
  })

  const soonRenewals = upcoming.filter((s) => {
    const days = Math.ceil(
      (s.nextRenewalDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )
    return days > 0
  })

  const totalUpcoming = upcoming.reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="text-sm font-medium">Reminder window</span>
        </div>
        <Select
          value={String(settings.reminderDaysBefore)}
          onValueChange={(v) => onUpdateSettings({ reminderDaysBefore: Number(v) })}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 day before</SelectItem>
            <SelectItem value="3">3 days before</SelectItem>
            <SelectItem value="7">7 days before</SelectItem>
            <SelectItem value="14">14 days before</SelectItem>
            <SelectItem value="30">30 days before</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {upcoming.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No upcoming renewals</p>
              <p className="text-sm text-muted-foreground">
                No subscriptions renewing in the next {settings.reminderDaysBefore} days
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {totalUpcoming > 0 && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {fmt(totalUpcoming)} due in the next {settings.reminderDaysBefore} days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {upcoming.length} renewal{upcoming.length !== 1 ? 's' : ''} coming up
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {todayRenewals.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Due Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayRenewals.map((sub) => (
                  <RenewalRow key={sub.id} subscription={sub} fmt={fmt} urgent />
                ))}
              </CardContent>
            </Card>
          )}

          {soonRenewals.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Coming Up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {soonRenewals.map((sub) => (
                  <RenewalRow key={sub.id} subscription={sub} fmt={fmt} />
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function RenewalRow({
  subscription,
  fmt,
  urgent,
}: {
  subscription: Subscription
  fmt: (n: number) => string
  urgent?: boolean
}) {
  const cat = getCategoryById(subscription.category)
  const renewDate = subscription.nextRenewalDate.toDate()
  const days = Math.ceil(
    (renewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: cat.color + '20' }}
      >
        <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{subscription.name}</p>
        <p className="text-xs text-muted-foreground">
          {days <= 0
            ? 'Today'
            : days === 1
              ? 'Tomorrow'
              : `In ${days} days`}{' '}
          &middot; {formatDate(renewDate)}
        </p>
      </div>
      <span
        className={`text-sm font-medium tabular-nums ${urgent ? 'text-destructive' : ''}`}
      >
        {fmt(subscription.amount)}
      </span>
    </div>
  )
}
