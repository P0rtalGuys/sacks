import { HashRouter, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { isElectron } from '@/lib/utils'
import { useAutoUpdate } from '@/hooks/useAutoUpdate'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ExpensesPage } from '@/pages/ExpensesPage'
import { BudgetsPage } from '@/pages/BudgetsPage'
import { SubscriptionsPage } from '@/pages/SubscriptionsPage'
import { SettingsPage } from '@/pages/SettingsPage'

function AutoUpdate() {
  useAutoUpdate()
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        {isElectron && (
          <div className="titlebar-drag fixed top-0 left-0 right-0 h-8 z-50" />
        )}
        <AutoUpdate />
        <Toaster position="bottom-right" richColors closeButton />
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
