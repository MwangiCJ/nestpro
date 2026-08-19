import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/currency';

export default function FeedExpenseIndex({ purchases: purchasesProp, monthTotal }) {
    const purchases = purchasesProp?.data ?? purchasesProp ?? [];
    const curr = formatCurrency;
    const fmt = n => Number(n ?? 0).toLocaleString();

    const confirmDelete = (id) => {
        if (confirm('Delete this purchase record?')) router.delete(`/feed-expenses/${id}`);
    };

    return (
        <AppLayout title="Feed Expense">
            <PageHeader
                title="Feed Purchases"
                subtitle={monthTotal ? `${curr(monthTotal)} this month` : ''}
                action={{ href: '/feed-expenses/create', label: 'Add Purchase' }}
            />

            {monthTotal !== undefined && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center mb-5">
                    <p className="text-sm font-bold text-amber-700">{curr(monthTotal)}</p>
                    <p className="text-xs text-gray-500">Feed Cost This Month</p>
                </div>
            )}

            {purchases.length === 0 ? (
                <EmptyState icon="🌾" title="No feed purchases" description="Log feed purchases to track feed expenses." action={{ href: '/feed-expenses/create', label: 'Add Purchase' }} />
            ) : (
                <div className="space-y-3">
                    {purchases.map(p => (
                        <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{p.feed_type}</p>
                                    <p className="text-sm text-gray-500">{p.brand || '—'} · {p.supplier || '—'}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{p.purchase_date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-amber-700">{curr(p.total_cost)}</p>
                                    <p className="text-xs text-gray-400">{fmt(p.quantity_kg)} kg</p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>@ {curr(p.unit_price)}/kg</span>
                                <div className="flex gap-3">
                                    <Link href={`/feed-expenses/${p.id}/edit`} className="text-amber-600 hover:underline">Edit</Link>
                                    <button onClick={() => confirmDelete(p.id)} className="text-red-500 hover:underline">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
