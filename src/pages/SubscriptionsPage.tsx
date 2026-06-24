import { useState } from 'react'
import { Plus, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useSubscriptionSettings } from '@/hooks/useSubscriptionSettings'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { getMonthlyAmount, getCancelSuggestions } from '@/services/subscriptions'
import { Button } from '@/components/ui/button'
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm'
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard'
import { SubscriptionAnalytics } from '@/components/subscriptions/SubscriptionAnalytics'
import { SubscriptionBudgetCard } from '@/components/subscriptions/SubscriptionBudgetCard'
import { RenewalReminders } from '@/components/subscriptions/RenewalReminders'
import { CancelSuggestions } from '@/components/subscriptions/CancelSuggestions'
import type { Subscription } from '@/types/subscription'

export function SubscriptionsPage() {
  const fmt = useFormatCurrency()
  const { subscriptions, loading } = useSubscriptions()
  const { settings, updateSettings } = useSubscriptionSettings()
  const { convert } = useExchangeRates()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const totalMonthly = subscriptions.reduce(
    (sum, s) => sum + convert(getMonthlyAmount(s), s.currency ?? 'USD'),
    0,
  )
  const totalYearly = totalMonthly * 12
  const suggestions = getCancelSuggestions(subscriptions)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground mt-1">
            {subscriptions.length} active &middot; <span className="text-foreground font-semibold">{fmt(totalMonthly)}/mo</span>
            {' '}&middot; {fmt(totalYearly)}/yr
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} size="lg">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      <SubscriptionBudgetCard
        totalMonthly={totalMonthly}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div>
          <div className="flex gap-1 mb-6 bg-secondary p-1 rounded-xl w-fit">
            {(['overview', 'analytics', 'reminders', 'suggestions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all flex items-center cursor-pointer rounded-lg',
                  activeTab === tab
                    ? 'bg-card text-foreground shadow-sm shadow-black/[0.06]'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'analytics' && 'Analytics'}
                {tab === 'reminders' && 'Reminders'}
                {tab === 'suggestions' && (
                  <>
                    Suggestions
                    {suggestions.length > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-chart-4 text-white text-xs font-medium">
                        {suggestions.length}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            subscriptions.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">No subscriptions yet</p>
                  <p className="text-sm mt-1">Add your first subscription to start tracking recurring costs</p>
                </div>
                <button
                  onClick={() => setFormOpen(true)}
                  className="mt-1 text-sm text-primary hover:underline font-medium cursor-pointer"
                >
                  + Add your first subscription
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub, index) => (
                  <div
                    key={sub.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <SubscriptionCard
                      subscription={sub}
                      convert={convert}
                      onEdit={(s) => {
                        setEditing(s)
                        setFormOpen(true)
                      }}
                    />
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'analytics' && (
            <SubscriptionAnalytics subscriptions={subscriptions} convert={convert} />
          )}

          {activeTab === 'reminders' && (
            <RenewalReminders
              subscriptions={subscriptions}
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          )}

          {activeTab === 'suggestions' && (
            <CancelSuggestions suggestions={suggestions} />
          )}
        </div>
      )}

      <SubscriptionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        subscription={editing}
      />
    </div>
  )
}