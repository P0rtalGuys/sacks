import { useRef, useState } from 'react'
import { Upload, FileSpreadsheet, FileJson, Sun, Moon, Monitor } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useTheme } from '@/context/ThemeContext'
import { exportJSON, exportExpensesCSV, importJSON } from '@/services/data-io'
import { CURRENCIES } from '@/lib/currencies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SettingsPage() {
  const { user } = useAuth()
  const { currency, setCurrency } = useCurrency()
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState('')
  const [exporting, setExporting] = useState(false)

  async function handleExportJSON() {
    setExporting(true)
    try {
      await exportJSON(user.uid)
    } finally {
      setExporting(false)
    }
  }

  async function handleExportCSV() {
    setExporting(true)
    try {
      await exportExpensesCSV(user.uid)
    } finally {
      setExporting(false)
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportStatus('Importing...')
    try {
      const result = await importJSON(user.uid, file)
      setImportStatus(
        `Imported ${result.expenses} expenses, ${result.budgets} budgets, ${result.subscriptions} subscriptions`,
      )
    } catch (err) {
      setImportStatus(`Error: ${err instanceof Error ? err.message : 'Import failed'}`)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} — {c.label} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              This changes how amounts are displayed across the app.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {([
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System', icon: Monitor },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer ${
                  theme === opt.value
                    ? 'border-primary gradient-primary text-white shadow-md shadow-primary/25'
                    : 'border-border bg-card hover:bg-secondary hover:border-primary/30'
                }`}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Export Data</CardTitle>
          <CardDescription>Download your data as a backup or spreadsheet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportJSON} disabled={exporting}>
            <FileJson className="h-4 w-4" />
            Export JSON Backup
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={exporting}>
            <FileSpreadsheet className="h-4 w-4" />
            Export Expenses CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Import Data</CardTitle>
          <CardDescription>Restore from a JSON backup file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Choose JSON File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          {importStatus && (
            <p className={`text-sm ${importStatus.startsWith('Error') ? 'text-destructive' : 'text-accent'}`}>
              {importStatus}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Note: Importing adds data — it does not replace existing records.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
