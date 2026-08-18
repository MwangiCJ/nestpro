import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';

const statusColors = {
    active: 'bg-green-100 text-green-700',
    sold: 'bg-blue-100 text-blue-700',
    depleted: 'bg-gray-100 text-gray-600',
    deceased: 'bg-red-100 text-red-700',
};

export default function FlockIndex({ flocks }) {
    return (
        <AppLayout title="Flock Register">
            <PageHeader
                title="Flock Register"
                subtitle={`${flocks.length} flock${flocks.length !== 1 ? 's' : ''}`}
                action={{ href: '/flocks/create', label: 'Add Flock' }}
            />

            {flocks.length === 0 ? (
                <EmptyState
                    icon="🐔"
                    title="No flocks yet"
                    description="Add your first flock to start tracking egg production, sales, and health records."
                    action={{ href: '/flocks/create', label: 'Add Flock' }}
                />
            ) : (
                <div className="space-y-3">
                    {flocks.map((flock) => (
                        <Link key={flock.id} href={`/flocks/${flock.id}`} className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-green-200 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-gray-800">{flock.name}</h3>
                                        <span className={`text-xs rounded-full px-2 py-0.5 ${statusColors[flock.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {flock.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-0.5 capitalize">{flock.bird_type} · {flock.breed || 'Unknown breed'}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Batch: {flock.batch_no}</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                    <p className="text-xl font-bold text-green-700">{Number(flock.current_quantity).toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">birds</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Age</p>
                                    <p className="text-sm font-medium">{flock.age_weeks ?? '—'} wks</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Initial</p>
                                    <p className="text-sm font-medium">{Number(flock.initial_quantity).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Source</p>
                                    <p className="text-sm font-medium capitalize">{flock.source || '—'}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
