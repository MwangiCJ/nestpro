import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';

const statusColors = {
    active: 'bg-green-100 text-green-700',
    under_construction: 'bg-amber-100 text-amber-700',
    closed: 'bg-gray-100 text-gray-500',
    quarantine: 'bg-red-100 text-red-700',
};

export default function HousingIndex({ houses }) {
    const confirmDelete = (id) => {
        if (confirm('Delete this house?')) router.delete(`/housing/${id}`);
    };

    return (
        <AppLayout title="Housing">
            <PageHeader
                title="Houses & Pens"
                subtitle={`${houses.length} house${houses.length !== 1 ? 's' : ''}`}
                action={{ href: '/housing/create', label: 'Add House' }}
            />

            {houses.length === 0 ? (
                <EmptyState icon="🏘️" title="No houses added" description="Add poultry houses/pens to assign flocks to them." action={{ href: '/housing/create', label: 'Add House' }} />
            ) : (
                <div className="space-y-3">
                    {houses.map(h => (
                        <div key={h.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-800">{h.name}</h3>
                                        <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${statusColors[h.status] ?? 'bg-gray-100'}`}>{h.status?.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 capitalize mt-0.5">{h.house_type?.replace('_', ' ')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-700">{Number(h.capacity ?? 0).toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">capacity</p>
                                </div>
                            </div>
                            {(h.length_m || h.width_m) && (
                                <p className="text-xs text-gray-400 mt-1">{h.length_m}m × {h.width_m}m</p>
                            )}
                            <div className="mt-2 flex justify-end gap-3">
                                <Link href={`/housing/${h.id}/edit`} className="text-xs text-amber-600 hover:underline">Edit</Link>
                                <button onClick={() => confirmDelete(h.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
