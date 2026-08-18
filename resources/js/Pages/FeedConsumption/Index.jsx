import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';

export default function FeedConsumptionIndex({ logs: logsProp, monthTotal }) {
    const consumptions = logsProp?.data ?? logsProp ?? [];
    const fmt = n => Number(n ?? 0).toLocaleString();

    const confirmDelete = (id) => {
        if (confirm('Delete this record?')) router.delete(`/feed-consumption/${id}`);
    };

    return (
        <AppLayout title="Feed Consumption">
            <PageHeader title="Feed Consumption"
                subtitle={monthTotal ? `${fmt(monthTotal)} kg this month` : ''}
                action={{ href: '/feed-consumption/create', label: 'Log Consumption' }} />

            {consumptions.length === 0 ? (
                <EmptyState icon="📊" title="No consumption logs" description="Track daily feed given to each flock." action={{ href: '/feed-consumption/create', label: 'Log Consumption' }} />
            ) : (
                <div className="space-y-3">
                    {consumptions.map(c => (
                        <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{c.flock?.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">{c.feed_type?.replace('_', ' ')} {c.brand ? `· ${c.brand}` : ''}</p>
                                    <p className="text-xs text-gray-400">{c.consumption_date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-700">{fmt(c.quantity_kg)} kg</p>
                                    {c.feed_per_bird && <p className="text-xs text-gray-400">{c.feed_per_bird}g/bird</p>}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end gap-3">
                                <Link href={`/feed-consumption/${c.id}/edit`} className="text-xs text-amber-600 hover:underline">Edit</Link>
                                <button onClick={() => confirmDelete(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
