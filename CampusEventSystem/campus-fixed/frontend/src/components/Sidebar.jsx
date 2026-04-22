/* eslint-disable */
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Search, BookMarked, CalendarDays,
  UserCircle, Bell, X, Zap, LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/student/dashboard',     icon: LayoutDashboard, label: 'Dashboard'        },
  { to: '/student/browse',        icon: Search,          label: 'Browse Events'    },
  { to: '/student/registrations', icon: BookMarked,      label: 'My Registrations' },
  { to: '/student/calendar',      icon: CalendarDays,    label: 'Calendar'         },
  { to: '/student/notifications', icon: Bell,            label: 'Notifications'    },
  { to: '/student/profile',       icon: UserCircle,      label: 'Profile'          },
]

export default function Sidebar({ open, onClose }) {
  const navigate   = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const userName   = storedUser.name  || 'Student'
  const userEmail  = storedUser.email || ''

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-60 bg-white shadow-lg z-30
          flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">EventSys</span>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Menu</p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="flex-1">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
