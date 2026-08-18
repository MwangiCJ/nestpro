import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const Field = ({ label, name, type = 'text', options, data, setData, errors }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {options ? (
            <select value={data[name]} onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 outline-none">
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        ) : (
            <input type={type} value={data[name] ?? ''} onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 outline-none" />
        )}
        {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
);

export default function HousingForm({ house }) {
    const isEdit = !!house;
    const { data, setData, post, put, errors, processing } = useForm({
        name: house?.name ?? '',
        house_type: house?.house_type ?? 'deep_litter',
        capacity: house?.capacity ?? '',
        length_m: house?.length_m ?? '',
        width_m: house?.width_m ?? '',
        status: house?.status ?? 'active',
        notes: house?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/housing/${house.id}`) : post('/housing');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit House' : 'Add House'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/housing" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit House' : '🏘️ Add House/Pen'}</h2>
                </div>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="House Name" name="name" {...fp} />
                    <Field label="House Type" name="house_type" options={[
                        { value: 'deep_litter', label: 'Deep Litter' },
                        { value: 'battery_cage', label: 'Battery Cage' },
                        { value: 'free_range', label: 'Free Range' },
                        { value: 'semi_intensive', label: 'Semi-Intensive' },
                        { value: 'brooder', label: 'Brooder' },
                        { value: 'isolation', label: 'Isolation' },
                    ]} {...fp} />
                    <Field label="Capacity (birds)" name="capacity" type="number" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Length (m)" name="length_m" type="number" {...fp} />
                        <Field label="Width (m)" name="width_m" type="number" {...fp} />
                    </div>
                    <Field label="Status" name="status" options={[
                        { value: 'active', label: '✅ Active' },
                        { value: 'under_construction', label: '🔨 Under Construction' },
                        { value: 'closed', label: '🔒 Closed' },
                        { value: 'quarantine', label: '⚠️ Quarantine' },
                    ]} {...fp} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Add House'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
