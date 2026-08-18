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

export default function EquipmentForm({ equipment: eq, houses }) {
    const isEdit = !!eq;
    const { data, setData, post, put, errors, processing } = useForm({
        name: eq?.name ?? '',
        category: eq?.category ?? 'feeder',
        quantity: eq?.quantity ?? '1',
        condition: eq?.condition ?? 'good',
        house_id: eq?.house_id ?? '',
        purchase_date: eq?.purchase_date ?? '',
        purchase_cost: eq?.purchase_cost ?? '',
        supplier: eq?.supplier ?? '',
        last_maintenance_date: eq?.last_maintenance_date ?? '',
        next_maintenance_date: eq?.next_maintenance_date ?? '',
        notes: eq?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/equipment/${eq.id}`) : post('/equipment');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Equipment' : 'Add Equipment'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/equipment" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Equipment' : '🔧 Add Equipment'}</h2>
                </div>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Equipment Name" name="name" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category" name="category" options={[
                            { value: 'feeder', label: 'Feeder' },
                            { value: 'drinker', label: 'Drinker/Waterer' },
                            { value: 'lamp', label: 'Lamp/Light' },
                            { value: 'ventilation', label: 'Ventilation/Fan' },
                            { value: 'incubator', label: 'Incubator' },
                            { value: 'egg_tray', label: 'Egg Tray/Crate' },
                            { value: 'spray', label: 'Sprayer' },
                            { value: 'cage', label: 'Cage/Battery' },
                            { value: 'generator', label: 'Generator' },
                            { value: 'other', label: 'Other' },
                        ]} {...fp} />
                        <Field label="Quantity" name="quantity" type="number" {...fp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Condition" name="condition" options={[
                            { value: 'new', label: '🆕 New' },
                            { value: 'good', label: '✅ Good' },
                            { value: 'fair', label: '🟡 Fair' },
                            { value: 'poor', label: '❌ Poor' },
                        ]} {...fp} />
                        {houses?.length > 0 && (
                            <Field label="Location (House)" name="house_id" options={[
                                { value: '', label: '— General —' },
                                ...houses.map(h => ({ value: h.id, label: h.name })),
                            ]} {...fp} />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Purchase Date" name="purchase_date" type="date" {...fp} />
                        <Field label="Purchase Cost" name="purchase_cost" type="number" {...fp} />
                    </div>
                    <Field label="Supplier" name="supplier" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Last Service Date" name="last_maintenance_date" type="date" {...fp} />
                        <Field label="Next Service Date" name="next_maintenance_date" type="date" {...fp} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Add Equipment'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
