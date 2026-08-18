import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';

export default function EggProductionIndex({ logs, monthTotal }) {
    const productions = logs?.data ?? logs ?? [];
    const fmt = n => Number(n ?? 0).toLocaleString();

    const confirmDelete = (id) => {
        if (confirm('Delete this egg log?')) router.delete(`/egg-production/${id}`);
    };

    return (
        <AppLayout title="Egg Production">
            <PageHeader
                title="Egg Production Log"
                subtitle={monthTotal ? `${fmt(monthTotal)} eggs this month` : ''}
                action={{ href: '/egg-production/create', label: 'Log Eggs' }}
            />

            {monthTotal !== undefined && (
                <div className="grid grid-cols-1 gap-2 mb-5">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-amber-700">{fmt(monthTotal)}</p>
                        <p className="text-xs text-gray-500">Eggs This Month</p>
                    </div>
                </div>
            )}

            {productions.length === 0 ? (
                <EmptyState icon="🥚" title="No egg logs yet" description="Start logging daily egg production to track your yield." action={{ href: '/egg-production/create', label: 'Log Eggs' }} />
            ) : (
                <div className="space-y-3">
                    {productions.map(p => (
                        <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{p.production_date}</p>
                                    <p className="text-sm text-gray-500">{p.flock?.name ?? '—'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-700">{fmt(p.total_eggs)}</p>
                                    <p className="text-xs text-gray-400">total eggs</p>
                                </div>
                            </div>
                            <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs">
                                <div className="bg-gray-50 rounded p-1.5">
                                    <p className="text-gray-400">Whole</p>
                                    <p className="font-semibold">{p.whole_eggs ?? 0}</p>
                                </div>
                                <div className="bg-red-50 rounded p-1.5">
                                    <p className="text-gray-400">Broken</p>
                                    <p className="font-semibold text-red-600">{p.broken_eggs ?? 0}</p>
                                </div>
                                <div className="bg-amber-50 rounded p-1.5">
                                    <p className="text-gray-400">Small</p>
                                    <p className="font-semibold">{p.small_eggs ?? 0}</p>
                                </div>
                                <div className="bg-gray-50 rounded p-1.5">
                                    <p className="text-gray-400">Soiled</p>
                                    <p className="font-semibold">{p.soiled_eggs ?? 0}</p>
                                </div>
                            </div>
                            {p.production_rate && (
                                <p className="text-xs text-gray-400 mt-2">Production rate: {p.production_rate}%</p>
                            )}
                            <div className="mt-3 flex gap-2 justify-end">
                                <Link href={`/egg-production/${p.id}/edit`} className="text-xs text-amber-600 hover:underline">Edit</Link>
                                <button onClick={() => confirmDelete(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
