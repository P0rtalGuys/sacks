import { Outlet } from 'react-router'
import { CurrencyProvider } from '@/context/CurrencyContext'
import { isElectron } from '@/lib/utils'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:pl-64">
          <div className={`p-6 md:p-8 pb-24 md:pb-8 ${isElectron ? 'pt-12' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </CurrencyProvider>
  )
}
