import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionSchema, type SubscriptionFormValues } from '@/schemas/subscription.schema'
import { addSubscription, updateSubscription } from '@/services/subscriptions'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { CURRENCIES } from '@/lib/currencies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Subscription } from '@/types/subscription'

interface Props {
  open: boolean
  onClose: () => void
  subscription?: Subscription | null
}

export function SubscriptionForm({ open, onClose, subscription }: Props) {
  const { user } = useAuth()
  const { currency: baseCurrency } = useCurrency()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription
      ? {
          name: subscription.name,
          amount: String(subscription.amount / 100),
          currency: subscription.currency ?? baseCurrency,
          billingCycle: subscription.billingCycle,
          nextRenewalDate: subscription.nextRenewalDate
            .toDate()
            .toISOString()
            .split('T')[0],
          notes: subscription.notes,
        }
      : {
          name: '',
          amount: '',
          currency: baseCurrency,
          billingCycle: 'monthly',
          nextRenewalDate: '',
          notes: '',
        },
  })

  const billingCycle = watch('billingCycle')
  const formCurrency = watch('currency')

  async function onSubmit(data: SubscriptionFormValues) {
    if (!user) return
    if (subscription) {
      await updateSubscription(subscription.id, data)
    } else {
      await addSubscription(user.uid, data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Edit Subscription' : 'Add Subscription'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g. Netflix" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount')}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formCurrency}
                onValueChange={(v) => setValue('currency', v)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select
                value={billingCycle}
                onValueChange={(v) =>
                  setValue('billingCycle', v as 'monthly' | 'quarterly' | 'yearly')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextRenewalDate">Next Renewal Date</Label>
            <Input
              id="nextRenewalDate"
              type="date"
              {...register('nextRenewalDate')}
            />
            {errors.nextRenewalDate && (
              <p className="text-sm text-destructive">
                {errors.nextRenewalDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional notes" {...register('notes')} />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : subscription
                  ? 'Update'
                  : 'Add Subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
