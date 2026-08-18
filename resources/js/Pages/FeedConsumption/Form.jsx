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

export default function FeedConsumptionForm({ consumption, flocks }) {
    const isEdit = !!consumption;
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, errors, processing } = useForm({
        flock_id: consumption?.flock_id ?? (flocks[0]?.id ?? ''),
        consumption_date: consumption?.consumption_date ?? today,
        feed_type: consumption?.feed_type ?? 'layers_mash',
        brand: consumption?.brand ?? '',
        quantity_kg: consumption?.quantity_kg ?? '',
        recorded_by: consumption?.recorded_by ?? '',
        notes: consumption?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/feed-consumption/${consumption.id}`) : post('/feed-consumption');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Feed Log' : 'Log Feed Consumption'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/feed-consumption" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Feed Log' : '📊 Log Feed Consumption'}</h2>
                </div>

                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Flock" name="flock_id" options={flocks.map(f => ({ value: f.id, label: f.name }))} {...fp} />
                    <Field label="Date" name="consumption_date" type="date" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Feed Type" name="feed_type" options={[
                            { value: 'layers_mash', label: 'Layers Mash' },
                            { value: 'layers_pellets', label: 'Layers Pellets' },
                            { value: 'broiler_starter', label: 'Broiler Starter' },
                            { value: 'broiler_finisher', label: 'Broiler Finisher' },
                            { value: 'growers_mash', label: 'Growers Mash' },
                            { value: 'chick_mash', label: 'Chick Mash' },
                            { value: 'other', label: 'Other' },
                        ]} {...fp} />
                        <Field label="Brand" name="brand" {...fp} />
                    </div>
                    <Field label="Quantity Given (kg)" name="quantity_kg" type="number" {...fp} />
                    <Field label="Recorded By" name="recorded_by" {...fp} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Save'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
