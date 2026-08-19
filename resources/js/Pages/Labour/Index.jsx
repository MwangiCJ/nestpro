import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/currency';

const paymentColors = { paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', partial: 'bg-blue-100 text-blue-700' };

export default function LabourIndex({ records, monthTotal, pendingPay }) {
    const rows = records?.data ?? [];
    const curr = formatCurrency;

    const confirmDelete = (id) => {
        if (confirm('Delete this labour record?')) router.delete(`/labour/${id}`);
    };

    return (
        <AppLayout title="Labour & Ops">
            <PageHeader
                title="Labour & Operations"
                subtitle={monthTotal ? `${curr(monthTotal)} this month` : ''}
                action={{ href: '/labour/create', label: 'Add Record' }}
            />

            {monthTotal !== undefined && (
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-blue-700">{curr(monthTotal)}</p>
                        <p className="text-xs text-gray-500">Paid This Month</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-amber-700">{curr(pendingPay)}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                    </div>
                </div>
            )}

            {rows.length === 0 ? (
                <EmptyState icon="👷" title="No labour records" description="Track worker wages, tasks, and payment status." action={{ href: '/labour/create', label: 'Add Record' }} />
            ) : (
                <div className="space-y-3">
                    {rows.map(r => (
                        <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-800">{r.worker_name}</h3>
                                        <span className={`text-xs rounded-full px-2 py-0.5 ${paymentColors[r.payment_status] ?? ''}`}>{r.payment_status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{r.task} · {r.worker_role || '—'}</p>
                                    <p className="text-xs text-gray-400">{r.work_date} · {r.hours_worked}h</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{curr(r.total_pay)}</p>
                                    <p className="text-xs text-gray-400">{curr(r.rate_per_hour)}/hr</p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end gap-3">
                                <Link href={`/labour/${r.id}/edit`} className="text-xs text-amber-600 hover:underline">Edit</Link>
                                <button onClick={() => confirmDelete(r.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
