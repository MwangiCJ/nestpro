export default function StatCard({ label, value, icon, color = 'green', sub }) {
    const colors = {
        green:  'bg-green-50 border-green-100 text-green-700',
        blue:   'bg-blue-50 border-blue-100 text-blue-700',
        amber:  'bg-amber-50 border-amber-100 text-amber-700',
        red:    'bg-red-50 border-red-100 text-red-700',
        purple: 'bg-purple-50 border-purple-100 text-purple-700',
        gray:   'bg-gray-50 border-gray-100 text-gray-700',
    };

    return (
        <div className={`rounded-xl border p-4 ${colors[color]}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium opacity-70 uppercase tracking-wide truncate">{label}</p>
                    <p className="text-2xl font-bold mt-1 truncate">{value ?? '—'}</p>
                    {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
                </div>
                {icon && <span className="text-2xl ml-2 flex-shrink-0">{icon}</span>}
            </div>
        </div>
    );
}
