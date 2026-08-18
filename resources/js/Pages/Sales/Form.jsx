import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const Field = ({ label, name, type = 'text', options, data, setData, errors, hint }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {options ? (
            <select value={data[name]} onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none">
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        ) : (
            <input type={type} value={data[name] ?? ''} onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
        )}
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
);

export default function SalesForm({ sale, flocks }) {
    const isEdit = !!sale;
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, errors, processing } = useForm({
        sale_type: sale?.sale_type ?? 'egg',
        flock_id: sale?.flock_id ?? (flocks[0]?.id ?? ''),
        sale_date: sale?.sale_date ?? today,
        quantity: sale?.quantity ?? '',
        unit: sale?.unit ?? 'crate',
        unit_price: sale?.unit_price ?? '',
        total_amount: sale?.total_amount ?? '',
        buyer_name: sale?.buyer_name ?? '',
        buyer_phone: sale?.buyer_phone ?? '',
        payment_status: sale?.payment_status ?? 'paid',
        amount_paid: sale?.amount_paid ?? '',
        receipt_no: sale?.receipt_no ?? '',
        notes: sale?.notes ?? '',
    });

    const calcTotal = () => {
        if (data.quantity && data.unit_price) {
            setData('total_amount', (parseFloat(data.quantity) * parseFloat(data.unit_price)).toFixed(2));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/sales/${sale.id}`) : post('/sales');
    };

    const fp = { data, setData, errors };

    const unitsByType = {
        egg: ['crate', 'tray', 'dozen', 'piece'],
        manure: ['bag', 'ton', 'kg', 'truckload'],
        meat: ['kg', 'piece', 'whole_bird'],
        live_bird: ['piece', 'dozen'],
        other: ['piece', 'kg', 'bag'],
    };

    const unitOptions = (unitsByType[data.sale_type] || ['piece']).map(u => ({ value: u, label: u }));

    return (
        <AppLayout title={isEdit ? 'Edit Sale' : 'New Sale'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/sales" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Sale' : '💰 Record Sale'}</h2>
                </div>

                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Sale Type" name="sale_type" options={[
                        { value: 'egg', label: '🥚 Eggs' },
                        { value: 'manure', label: '🌱 Manure' },
                        { value: 'meat', label: '🍗 Meat' },
                        { value: 'live_bird', label: '🐔 Live Birds' },
                        { value: 'other', label: '📦 Other' },
                    ]} {...fp} />

                    {flocks.length > 0 && (
                        <Field label="Flock (optional)" name="flock_id" options={[
                            { value: '', label: '— No specific flock —' },
                            ...flocks.map(f => ({ value: f.id, label: f.name })),
                        ]} {...fp} />
                    )}

                    <Field label="Sale Date" name="sale_date" type="date" {...fp} />

                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                            <Field label="Quantity" name="quantity" type="number" {...fp} />
                        </div>
                        <div className="col-span-1">
                            <Field label="Unit" name="unit" options={unitOptions} {...fp} />
                        </div>
                        <div className="col-span-1">
                            <Field label="Unit Price" name="unit_price" type="number" {...fp} />
                        </div>
                    </div>

                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Field label="Total Amount (GH₵)" name="total_amount" type="number" {...fp} />
                        </div>
                        <button type="button" onClick={calcTotal} className="mb-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-2.5 rounded-lg whitespace-nowrap">
                            Auto-calc
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Buyer Name" name="buyer_name" {...fp} />
                        <Field label="Buyer Phone" name="buyer_phone" type="tel" {...fp} />
                    </div>

                    <Field label="Payment Status" name="payment_status" options={[
                        { value: 'paid', label: '✅ Fully Paid' },
                        { value: 'partial', label: '🟡 Partial Payment' },
                        { value: 'unpaid', label: '❌ Unpaid' },
                    ]} {...fp} />

                    {(data.payment_status === 'partial') && (
                        <Field label="Amount Paid (GH₵)" name="amount_paid" type="number" {...fp} />
                    )}

                    <Field label="Receipt No." name="receipt_no" {...fp} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update Sale' : 'Record Sale'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
