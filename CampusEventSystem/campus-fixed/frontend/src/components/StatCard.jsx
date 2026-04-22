export default function StatCard({ icon: Icon, label, value, change, color = 'brand' }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-50',   icon: 'text-brand-500',  badge: 'bg-brand-100 text-brand-600'  },
    green:  { bg: 'bg-emerald-50', icon: 'text-emerald-500',badge: 'bg-emerald-100 text-emerald-600'},
    amber:  { bg: 'bg-amber-50',   icon: 'text-amber-500',  badge: 'bg-amber-100 text-amber-600'  },
    violet: { bg: 'bg-violet-50',  icon: 'text-violet-500', badge: 'bg-violet-100 text-violet-600'},
  }

  const c = colorMap[color] ?? colorMap.brand

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className={`${c.bg} rounded-xl p-3 shrink-0`}>
        <Icon size={20} className={c.icon} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-display font-bold text-gray-900 mt-0.5">{value}</p>
        {change && (
          <p className={`text-xs font-medium mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${c.badge}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  )
}
