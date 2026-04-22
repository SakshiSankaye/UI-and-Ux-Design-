/* eslint-disable */
import { Bell, Menu, Search, LogOut, UserCircle } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../services/api'

export default function TopNavbar({ onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [showMenu,      setShowMenu]      = useState(false)
  const [unread,        setUnread]        = useState(0)
  const navigate   = useNavigate()
  const location   = useLocation()
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const userName   = storedUser.name  || 'Student'
  const userEmail  = storedUser.email || ''

  const fetchUnread = useCallback(async () => {
    try {
      const res = await API.get('/api/notifications')
      const count = (res.data || []).filter(n => !n.read).length
      setUnread(count)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    // Only fetch if logged in as student
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    if (u.role === 'student') fetchUnread()
  }, [fetchUnread, location.pathname])

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4">
      <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500" onClick={onMenuClick}>
        <Menu size={20} />
      </button>

      <div className={`flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 max-w-sm transition-all
          ${searchFocused ? 'ring-2 ring-blue-200 bg-white' : ''}`}>
        <Search size={15} className="text-gray-400 shrink-0" />
        <input type="text" placeholder="Search events…"
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
      </div>

      <div className="ml-auto flex items-center gap-2 relative">
        {/* Notification Bell */}
        <button onClick={() => navigate('/student/notifications')}
          className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button onClick={() => setShowMenu(v => !v)}
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors">
            {userName.charAt(0).toUpperCase()}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
              <button onClick={() => { navigate('/student/profile'); setShowMenu(false) }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                <UserCircle size={15} /> My Profile
              </button>
              <button onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-medium">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
        {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
      </div>
    </header>
  )
}
