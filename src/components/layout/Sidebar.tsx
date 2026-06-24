import { NavLink } from 'react-router'
import { LayoutDashboard, Receipt, PiggyBank, CreditCard, Settings } from 'lucide-react'
import { cn, isElectron } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar">
        <div className="flex flex-col flex-1 min-h-0">
          {isElectron && <div className="h-8 shrink-0 titlebar-drag" />}

          {/* Logo */}
          <div className="flex items-center gap-3 h-16 px-5 titlebar-no-drag">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-xl leading-none select-none shrink-0"
              style={{ background: 'linear-gradient(135deg, oklch(0.54 0.24 292 / 0.35), oklch(0.65 0.185 162 / 0.25))' }}
            >
              💰
            </div>
            <span
              className="text-xl font-semibold tracking-wide text-white"
              style={{ fontFamily: "'Fredoka', system-ui, sans-serif" }}
            >
              Sack
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-3 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-white/[0.12] text-white'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground/90 hover:bg-white/[0.06]',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 glass">
        <div className="flex justify-around py-2 px-2">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-all rounded-xl',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
