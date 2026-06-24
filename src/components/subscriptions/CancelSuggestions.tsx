import { Lightbulb, XCircle, Clock } from 'lucide-react'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { getCategoryById } from '@/lib/categories'
import { cancelSubscription } from '@/services/subscriptions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { CancelSuggestion } from '@/types/subscription'

interface Props {
  suggestions: CancelSuggestion[]
}

export function CancelSuggestions({ suggestions }: Props) {
  const fmt = useFormatCurrency()

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Lightbulb className="h-8 w-8 text-accent" />
          <div>
            <p className="font-medium">All subscriptions look good!</p>
            <p className="text-sm text-muted-foreground">
              No cancel suggestions right now. Keep marking subscriptions as used to
              get better recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalSavings = suggestions.reduce((sum, s) => sum + s.savingsPerMonth, 0)

  return (
    <div className="space-y-4">
      <Card className="border-chart-4/30 bg-chart-4/5">
        <CardContent className="p-4 flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-chart-4 shrink-0" />
          <div>
            <p className="text-sm font-medium">
              You could save up to {fmt(totalSavings)}/mo
            </p>
            <p className="text-xs text-muted-foreground">
              {suggestions.length} subscription{suggestions.length !== 1 ? 's' : ''} flagged for review
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-chart-4" />
            Cancel Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map((suggestion) => {
            const cat = getCategoryById(suggestion.subscription.category)
            return (
              <div
                key={suggestion.subscription.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{suggestion.subscription.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {suggestion.reason}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {suggestion.daysSinceLastUse !== null
                        ? `${suggestion.daysSinceLastUse}d since last use`
                        : 'Never used'}
                    </span>
                    <span>Save {fmt(suggestion.savingsPerMonth)}/mo</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => cancelSubscription(suggestion.subscription.id)}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Cancel
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
