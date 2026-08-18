import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const Field = ({ label, name, type = 'text', options, data, setData, errors }) => (
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
        {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
);

export default function FeedExpenseForm({ purchase }) {
    const isEdit = !!purchase;
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, errors, processing } = useForm({
        purchase_date: purchase?.purchase_date ?? today,
        feed_type: purchase?.feed_type ?? 'layers_mash',
        brand: purchase?.brand ?? '',
        quantity_kg: purchase?.quantity_kg ?? '',
        unit_price: purchase?.unit_price ?? '',
        total_cost: purchase?.total_cost ?? '',
        supplier: purchase?.supplier ?? '',
        invoice_no: purchase?.invoice_no ?? '',
        payment_status: purchase?.payment_status ?? 'paid',
        notes: purchase?.notes ?? '',
    });

    const calcTotal = () => {
        if (data.quantity_kg && data.unit_price) {
            setData('total_cost', (parseFloat(data.quantity_kg) * parseFloat(data.unit_price)).toFixed(2));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/feed-expenses/${purchase.id}`) : post('/feed-expenses');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Feed Purchase' : 'Add Feed Purchase'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/feed-expenses" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Feed Purchase' : '🌾 Log Feed Purchase'}</h2>
                </div>

                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Purchase Date" name="purchase_date" type="date" {...fp} />
                    <Field label="Feed Type" name="feed_type" options={[
                        { value: 'layers_mash', label: 'Layers Mash' },
                        { value: 'layers_pellets', label: 'Layers Pellets' },
                        { value: 'broiler_starter', label: 'Broiler Starter' },
                        { value: 'broiler_finisher', label: 'Broiler Finisher' },
                        { value: 'growers_mash', label: 'Growers Mash' },
                        { value: 'chick_mash', label: 'Chick Mash' },
                        { value: 'concentrate', label: 'Concentrate' },
                        { value: 'other', label: 'Other' },
                    ]} {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Brand" name="brand" {...fp} />
                        <Field label="Supplier" name="supplier" {...fp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Quantity (kg)" name="quantity_kg" type="number" {...fp} />
                        <Field label="Price per kg (GH₵)" name="unit_price" type="number" {...fp} />
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Field label="Total Cost (GH₵)" name="total_cost" type="number" {...fp} />
                        </div>
                        <button type="button" onClick={calcTotal} className="mb-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-2.5 rounded-lg">
                            Calc
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Invoice No." name="invoice_no" {...fp} />
                        <Field label="Payment Status" name="payment_status" options={[
                            { value: 'paid', label: '✅ Paid' },
                            { value: 'credit', label: '📋 Credit' },
                        ]} {...fp} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Save Purchase'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
