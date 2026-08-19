import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';

const typeColors = {
    vaccination: 'bg-blue-100 text-blue-700',
    treatment: 'bg-red-100 text-red-700',
    deworming: 'bg-purple-100 text-purple-700',
    vitamin_supplement: 'bg-green-100 text-green-700',
    inspection: 'bg-gray-100 text-gray-600',
    biosecurity: 'bg-amber-100 text-amber-700',
};

export default function HealthIndex({ records, upcoming }) {
    const rows = records?.data ?? [];
    const curr = n => `GH₵ ${Number(n ?? 0).toFixed(2)}`;

    const confirmDelete = (id) => {
        if (confirm('Delete this health record?')) router.delete(`/health/${id}`);
    };

    return (
        <AppLayout title="Vet & Health">
            <PageHeader
                title="Vet & Health Records"
                subtitle={`${records?.total ?? rows.length} records`}
                action={{ href: '/health/create', label: 'Add Record' }}
            />

            {upcoming?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                    <h3 className="font-semibold text-amber-800 text-sm mb-2">⚠️ Upcoming / Due</h3>
                    {upcoming.map(h => (
                        <div key={h.id} className="flex justify-between py-1.5 border-b border-amber-100 last:border-0">
                            <div>
                                <p className="text-sm text-gray-700">{h.vaccine_drug_name || h.record_type}</p>
                                <p className="text-xs text-gray-500">{h.flock?.name}</p>
                            </div>
                            <span className="text-xs text-amber-800 font-medium">{h.next_due_date}</span>
                        </div>
                    ))}
                </div>
            )}

            {rows.length === 0 ? (
                <EmptyState icon="💉" title="No health records" description="Log vaccinations, treatments, and vet visits." action={{ href: '/health/create', label: 'Add Record' }} />
            ) : (
                <div className="space-y-3">
                    {rows.map(h => (
                        <div key={h.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${typeColors[h.record_type] ?? 'bg-gray-100'}`}>{h.record_type?.replace('_', ' ')}</span>
                                        {h.status === 'done' && <span className="text-xs text-green-600">✅ Done</span>}
                                        {h.status === 'scheduled' && <span className="text-xs text-blue-600">📅 Scheduled</span>}
                                    </div>
                                    <p className="font-semibold text-gray-800 mt-1">{h.vaccine_drug_name || h.disease_condition || '—'}</p>
                                    <p className="text-sm text-gray-500">{h.flock?.name} · {h.record_date}</p>
                                    {h.vet_name && <p className="text-xs text-gray-400 mt-0.5">Vet: {h.vet_name}</p>}
                                </div>
                                <div className="text-right">
                                    {h.cost && <p className="text-sm font-semibold text-gray-700">{curr(h.cost)}</p>}
                                    {h.next_due_date && <p className="text-xs text-amber-600">Next: {h.next_due_date}</p>}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end gap-3">
                                <Link href={`/health/${h.id}/edit`} className="text-xs text-amber-600 hover:underline">Edit</Link>
                                <button onClick={() => confirmDelete(h.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
