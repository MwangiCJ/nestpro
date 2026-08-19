import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/currency';

const typeIcons = { egg: '🥚', manure: '🌱', meat: '🍗', live_bird: '🐔', other: '📦' };
const paymentColors = { paid: 'bg-green-100 text-green-700', partial: 'bg-amber-100 text-amber-700', unpaid: 'bg-red-100 text-red-700' };

export default function SalesIndex({ sales: salesProp, monthTotal, pendingAmount }) {
    const sales = salesProp?.data ?? salesProp ?? [];
    const curr = formatCurrency;

    const confirmDelete = (id) => {
        if (confirm('Delete this sale record?')) router.delete(`/sales/${id}`);
    };

    return (
        <AppLayout title="Sales">
            <PageHeader
                title="Sales Records"
                subtitle={monthTotal ? `${curr(monthTotal)} this month` : ''}
                action={{ href: '/sales/create', label: 'New Sale' }}
            />

            {monthTotal !== undefined && (
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-green-700">{curr(monthTotal)}</p>
                        <p className="text-xs text-gray-500">This Month</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                        <p className="text-sm font-bold text-amber-700">{curr(pendingAmount)}</p>
                        <p className="text-xs text-gray-500">Outstanding</p>
                    </div>
                </div>
            )}

            {sales.length === 0 ? (
                <EmptyState icon="💰" title="No sales yet" description="Record egg, meat, manure or live bird sales." action={{ href: '/sales/create', label: 'New Sale' }} />
            ) : (
                <div className="space-y-3">
                    {sales.map(s => (
                        <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{typeIcons[s.sale_type] ?? '📦'}</span>
                                        <span className="font-semibold text-gray-800 capitalize">{s.sale_type?.replace('_', ' ')} Sale</span>
                                        <span className={`text-xs rounded-full px-2 py-0.5 ${paymentColors[s.payment_status] ?? ''}`}>{s.payment_status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-0.5">{s.sale_date} · {s.buyer_name || 'Unknown buyer'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{curr(s.total_amount)}</p>
                                    {s.payment_status !== 'paid' && (
                                        <p className="text-xs text-red-500">Due: {curr(s.total_amount - s.amount_paid)}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>Qty: {s.quantity} {s.unit} @ {curr(s.unit_price)}/{s.unit}</span>
                                <div className="flex gap-3">
                                    <Link href={`/sales/${s.id}/edit`} className="text-amber-600 hover:underline">Edit</Link>
                                    <button onClick={() => confirmDelete(s.id)} className="text-red-500 hover:underline">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
