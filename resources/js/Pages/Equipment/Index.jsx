import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/currency';

const conditionColors = { good: 'bg-green-100 text-green-700', fair: 'bg-amber-100 text-amber-700', poor: 'bg-red-100 text-red-700', new: 'bg-blue-100 text-blue-700' };

export default function EquipmentIndex({ equipment }) {
    const curr = formatCurrency;
    const fmt = n => Number(n ?? 0).toLocaleString();

    const confirmDelete = (id) => {
        if (confirm('Delete this equipment?')) router.delete(`/equipment/${id}`);
    };

    return (
        <AppLayout title="Equipment">
            <PageHeader
                title="Equipment"
                subtitle={`${equipment.length} item${equipment.length !== 1 ? 's' : ''}`}
                action={{ href: '/equipment/create', label: 'Add Equipment' }}
            />

            {equipment.length === 0 ? (
                <EmptyState icon="🔧" title="No equipment yet" description="Track feeders, drinkers, lamps, and other farm equipment." action={{ href: '/equipment/create', label: 'Add Equipment' }} />
            ) : (
                <div className="space-y-3">
                    {equipment.map(e => (
                        <div key={e.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-800">{e.name}</h3>
                                        <span className={`text-xs rounded-full px-2 py-0.5 ${conditionColors[e.condition] ?? 'bg-gray-100'}`}>{e.condition}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 capitalize mt-0.5">{e.category?.replace('_', ' ')} · {e.house?.name || 'Unassigned'}</p>
                                    {e.next_maintenance_date && <p className="text-xs text-amber-600 mt-0.5">Next service: {e.next_maintenance_date}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-700">× {fmt(e.quantity)}</p>
                                    {e.purchase_cost && <p className="text-xs text-gray-400">{curr(e.purchase_cost)}</p>}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end gap-3">
                                <Link href={`/equipment/${e.id}/edit`} className="text-xs text-amber-600 hover:underline">Edit</Link>
                                <button onClick={() => confirmDelete(e.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
