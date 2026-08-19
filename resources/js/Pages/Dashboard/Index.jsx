import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/StatCard';
import { Link } from '@inertiajs/react';
import { CURRENCY_SYMBOL } from '@/utils/currency';

function fmt(n) {
    if (n === undefined || n === null) return '—';
    return Number(n).toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function currency(n, symbol = CURRENCY_SYMBOL) {
    if (n === undefined || n === null) return '—';
    return `${symbol} ${Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardIndex({ farm, stats, upcomingHealth, recentEggLogs, eggChartData, salesByType, flocks }) {
    if (!farm) {
        return (
            <AppLayout title="Dashboard">
                <div className="max-w-lg mx-auto mt-16 text-center">
                    <span className="text-6xl">🐓</span>
                    <h2 className="text-xl font-bold text-gray-800 mt-4">Welcome to NestPro!</h2>
                    <p className="text-gray-500 mt-2">You haven't set up your farm yet. Get started by creating your farm profile.</p>
                    <Link
                        href="/farm/create"
                        className="mt-6 inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800"
                    >
                        🏡 Set Up My Farm
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const maxEggs = Math.max(...(eggChartData?.map(d => d.eggs) || [1]), 1);

    return (
        <AppLayout title="Dashboard">
            {/* Farm banner */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div>
                    <p className="text-green-200 text-xs uppercase tracking-wide">Welcome back</p>
                    <h2 className="font-bold text-lg leading-tight">{farm.name}</h2>
                    <p className="text-green-200 text-sm">{farm.location}</p>
                </div>
                <span className="text-4xl">🐓</span>
            </div>

            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <StatCard label="Active Birds" value={fmt(stats.total_active_birds)} icon="🐔" color="green" sub={`${stats.active_flocks} flock${stats.active_flocks !== 1 ? 's' : ''}`} />
                <StatCard label="Today's Eggs" value={fmt(stats.today_eggs)} icon="🥚" color="blue" sub={`${fmt(stats.month_eggs)} this month`} />
                <StatCard label="Monthly Sales" value={currency(stats.monthly_sales)} icon="💰" color="amber" />
                <StatCard label="Net Profit" value={currency(stats.net_profit)} icon={stats.net_profit >= 0 ? '📈' : '📉'} color={stats.net_profit >= 0 ? 'green' : 'red'} />
            </div>

            {/* Expenses breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Monthly Expenses</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-xs text-gray-500">Feed</p>
                        <p className="font-bold text-red-600 text-sm">{currency(stats.monthly_feed_cost)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Health</p>
                        <p className="font-bold text-red-600 text-sm">{currency(stats.monthly_health_cost)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Labour</p>
                        <p className="font-bold text-red-600 text-sm">{currency(stats.monthly_labour_cost)}</p>
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm">
                    <span className="text-gray-500">Total Expenses</span>
                    <span className="font-bold text-red-700">{currency(stats.monthly_expenses)}</span>
                </div>
            </div>

            {/* Egg production chart (last 7 days) */}
            {eggChartData?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                    <h3 className="font-semibold text-gray-700 mb-3 text-sm">Egg Production – Last 7 Days</h3>
                    <div className="flex items-end gap-1.5 h-24">
                        {eggChartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs text-gray-500">{d.eggs}</span>
                                <div
                                    className="w-full bg-green-500 rounded-t"
                                    style={{ height: `${Math.max(4, (d.eggs / maxEggs) * 80)}px` }}
                                />
                                <span className="text-xs text-gray-400">{d.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sales by type */}
            {salesByType?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                    <h3 className="font-semibold text-gray-700 mb-3 text-sm">Sales Breakdown (This Month)</h3>
                    {salesByType.map((s, i) => (
                        <div key={i} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                            <span className="text-sm text-gray-600">{s.type}</span>
                            <span className="text-sm font-semibold">{currency(s.total)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Upcoming health schedules */}
            {upcomingHealth?.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
                    <h3 className="font-semibold text-amber-800 mb-3 text-sm flex items-center gap-2">
                        <span>💉</span> Upcoming Health Schedule
                    </h3>
                    {upcomingHealth.map((h) => (
                        <div key={h.id} className="flex items-center justify-between py-1.5 border-b border-amber-100 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{h.vaccine_drug_name || h.record_type}</p>
                                <p className="text-xs text-gray-500">{h.flock?.name}</p>
                            </div>
                            <span className="text-xs bg-amber-200 text-amber-800 rounded-full px-2 py-0.5">
                                {new Date(h.next_due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    ))}
                    <Link href="/health" className="block mt-2 text-xs text-amber-700 font-medium">View all →</Link>
                </div>
            )}

            {/* Active flocks */}
            {flocks?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Active Flocks</h3>
                        <Link href="/flocks" className="text-xs text-green-700">View all →</Link>
                    </div>
                    {flocks.map((f) => (
                        <Link key={f.id} href={`/flocks/${f.id}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{f.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{f.bird_type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-green-700">{fmt(f.current_quantity)}</p>
                                <p className="text-xs text-gray-400">birds</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Mortality this month */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <StatCard label="Mortality" value={fmt(stats.monthly_mortality)} icon="📉" color="red" sub="this month" />
                <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col justify-center">
                    <Link href="/egg-production/create" className="text-center block">
                        <span className="text-2xl">+ 🥚</span>
                        <p className="text-xs text-gray-600 mt-1">Log Eggs</p>
                    </Link>
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { href: '/egg-production/create', icon: '🥚', label: 'Log Eggs' },
                        { href: '/mortality/create', icon: '📉', label: 'Mortality' },
                        { href: '/sales/create', icon: '💰', label: 'New Sale' },
                        { href: '/feed-expenses/create', icon: '🌾', label: 'Feed Purchase' },
                        { href: '/health/create', icon: '💉', label: 'Health Record' },
                        { href: '/flocks/create', icon: '🐔', label: 'New Flock' },
                    ].map((a) => (
                        <a
                            key={a.href}
                            href={a.href}
                            className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 hover:text-green-700 transition-colors text-center"
                        >
                            <span className="text-xl mb-1">{a.icon}</span>
                            <span className="text-xs text-gray-600">{a.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
