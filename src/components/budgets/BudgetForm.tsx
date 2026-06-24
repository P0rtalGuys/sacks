import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { budgetSchema } from '@/schemas/budget.schema'
import { addBudget, updateBudget } from '@/services/budgets'
import { useAuth } from '@/context/AuthContext'
import { CATEGORIES } from '@/lib/categories'
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
import type { Budget, BudgetFormData } from '@/types/budget'

interface Props {
  open: boolean
  onClose: () => void
  month: string
  budget?: Budget | null
  existingCategories: string[]
}

export function BudgetForm({ open, onClose, month, budget, existingCategories }: Props) {
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget
      ? { category: budget.category, limit: String(budget.limit / 100) }
      : { category: '', limit: '' },
  })

  const category = watch('category')

  const availableCategories = budget
    ? CATEGORIES
    : CATEGORIES.filter((c) => !existingCategories.includes(c.id))

  async function onSubmit(data: BudgetFormData) {
    if (!user) return
    if (budget) {
      await updateBudget(budget.id, data)
    } else {
      await addBudget(user.uid, month, data)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Set Budget'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setValue('category', v)}
              disabled={!!budget}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Monthly Limit</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('limit')}
            />
            {errors.limit && (
              <p className="text-sm text-destructive">{errors.limit.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : budget ? 'Update' : 'Set Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
