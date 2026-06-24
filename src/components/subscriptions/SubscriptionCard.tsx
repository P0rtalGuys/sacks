import { Pencil, Trash2, XCircle, CheckCircle2 } from 'lucide-react'
import { formatDate, formatCurrency, getNameColor, getInitials } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import {
  getMonthlyAmount,
  cancelSubscription,
  deleteSubscription,
  markSubscriptionUsed,
} from '@/services/subscriptions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Subscription } from '@/types/subscription'

interface Props {
  subscription: Subscription
  onEdit: (sub: Subscription) => void
  convert: (amountInCents: number, fromCurrency: string) => number
}

export function SubscriptionCard({ subscription, onEdit, convert }: Props) {
  const fmt = useFormatCurrency()
  const monthlyAmount = getMonthlyAmount(subscription)
  const subCurrency = subscription.currency ?? 'USD'
  const convertedMonthly = convert(monthlyAmount, subCurrency)
  const renewalDate = subscription.nextRenewalDate.toDate()
  const daysUntilRenewal = Math.ceil(
    (renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )

  const lastUsed = subscription.lastUsedDate?.toDate()
  const daysSinceUse = lastUsed
    ? Math.floor((Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isUrgent = daysUntilRenewal <= 3

  return (
    <Card className="group hover:border-primary/25 hover:shadow-md hover:shadow-black/[0.04] transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
            style={{ backgroundColor: getNameColor(subscription.name) }}
          >
            {getInitials(subscription.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold leading-tight">{subscription.name}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {formatCurrency(subscription.amount, subCurrency)}/{subscription.billingCycle}
              {' '}&middot; {fmt(convertedMonthly)}/mo
            </p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              {daysSinceUse !== null
                ? daysSinceUse === 0
                  ? 'Used today'
                  : `Used ${daysSinceUse}d ago`
                : 'Never marked as used'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-sm font-semibold ${isUrgent ? 'text-chart-4' : 'text-muted-foreground'}`}>
              {daysUntilRenewal <= 0
                ? 'Due today'
                : daysUntilRenewal === 1
                  ? 'Tomorrow'
                  : `In ${daysUntilRenewal}d`}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {formatDate(renewalDate)}
            </p>
          </div>
          <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => markSubscriptionUsed(subscription.id)}
              title="Mark as used today"
            >
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(subscription)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cancelSubscription(subscription.id)}
              title="Cancel subscription"
            >
              <XCircle className="h-4 w-4 text-chart-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSubscription(subscription.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        {subscription.notes && (
          <p className="text-sm text-muted-foreground mt-2 pl-16">
            {subscription.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
