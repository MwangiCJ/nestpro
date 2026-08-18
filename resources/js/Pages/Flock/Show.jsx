import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';

export default function FlockShow({ flock, recentEggs, upcomingHealth }) {
    const fmt = (n) => Number(n ?? 0).toLocaleString();
    const mortalityRate = flock.initial_quantity > 0
        ? (((flock.initial_quantity - flock.current_quantity) / flock.initial_quantity) * 100).toFixed(1)
        : 0;

    const details = [
        ['Bird Type', flock.bird_type],
        ['Breed', flock.breed || '—'],
        ['Batch No.', flock.batch_no],
        ['Source', flock.source],
        ['Source Name', flock.source_name || '—'],
        ['Arrival Date', flock.arrival_date],
        ['Age at Arrival', `${flock.age_weeks} weeks`],
        ['Purchase Cost', flock.purchase_cost ? `GH₵ ${Number(flock.purchase_cost).toFixed(2)}` : '—'],
        ['House', flock.house?.name || 'Not assigned'],
        ['Status', flock.status],
    ];

    const confirmDelete = () => {
        if (confirm('Delete this flock? This cannot be undone.')) {
            router.delete(`/flocks/${flock.id}`);
        }
    };

    return (
        <AppLayout title={flock.name}>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <Link href="/flocks" className="text-sm text-gray-500 hover:text-green-700">← Flocks</Link>
                    <h2 className="text-xl font-bold text-gray-800">{flock.name}</h2>
                </div>
                <div className="flex gap-2">
                    <Link href={`/flocks/${flock.id}/edit`} className="text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg">Edit</Link>
                    <button onClick={confirmDelete} className="text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded-lg">Delete</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">{fmt(flock.current_quantity)}</p>
                    <p className="text-xs text-gray-500">Current Birds</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{mortalityRate}%</p>
                    <p className="text-xs text-gray-500">Mortality Rate</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-amber-700">{flock.age_weeks ?? '—'}</p>
                    <p className="text-xs text-gray-500">Weeks Old</p>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 mb-5">
                {details.map(([label, value]) => (
                    <div key={label} className="flex justify-between px-4 py-3">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-medium text-gray-800 capitalize">{value}</span>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <Link href={`/egg-production/create?flock_id=${flock.id}`} className="flex items-center gap-2 justify-center bg-green-50 border border-green-100 text-green-700 font-medium py-3 rounded-xl text-sm">
                    🥚 Log Eggs
                </Link>
                <Link href={`/mortality/create?flock_id=${flock.id}`} className="flex items-center gap-2 justify-center bg-red-50 border border-red-100 text-red-700 font-medium py-3 rounded-xl text-sm">
                    📉 Log Mortality
                </Link>
                <Link href={`/health/create?flock_id=${flock.id}`} className="flex items-center gap-2 justify-center bg-blue-50 border border-blue-100 text-blue-700 font-medium py-3 rounded-xl text-sm">
                    💉 Health Record
                </Link>
                <Link href={`/feed-consumption/create?flock_id=${flock.id}`} className="flex items-center gap-2 justify-center bg-amber-50 border border-amber-100 text-amber-700 font-medium py-3 rounded-xl text-sm">
                    🌾 Feed Log
                </Link>
            </div>

            {/* Recent eggs */}
            {recentEggs?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
                    <h3 className="font-semibold text-gray-700 text-sm mb-3">Recent Egg Logs</h3>
                    {recentEggs.slice(0, 5).map((egg) => (
                        <div key={egg.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                            <span className="text-sm text-gray-600">{egg.production_date}</span>
                            <span className="text-sm font-semibold text-green-700">{fmt(egg.total_eggs)} eggs</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Recent health */}
            {upcomingHealth?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-700 text-sm mb-3">Upcoming Health Schedule</h3>
                    {upcomingHealth.slice(0, 3).map((h) => (
                        <div key={h.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                            <div>
                                <p className="text-sm text-gray-700">{h.vaccine_drug_name || h.record_type}</p>
                                <p className="text-xs text-gray-400">{h.record_date}</p>
                            </div>
                            <span className={`text-xs rounded-full px-2 py-1 self-center ${h.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {h.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
