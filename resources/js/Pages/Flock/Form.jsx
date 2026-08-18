import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const Field = ({ label, name, type = 'text', options, required, data, setData, errors }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {options ? (
            <select
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        ) : (
            <input
                type={type}
                value={data[name] ?? ''}
                onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
        )}
        {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
);

export default function FlockForm({ flock, houses }) {
    const isEdit = !!flock;
    const { data, setData, post, put, errors, processing } = useForm({
        name: flock?.name ?? '',
        batch_no: flock?.batch_no ?? '',
        bird_type: flock?.bird_type ?? 'layer',
        breed: flock?.breed ?? '',
        initial_quantity: flock?.initial_quantity ?? '',
        current_quantity: flock?.current_quantity ?? '',
        source: flock?.source ?? 'purchased',
        source_name: flock?.source_name ?? '',
        arrival_date: flock?.arrival_date ?? '',
        age_weeks: flock?.age_weeks ?? '',
        purchase_cost: flock?.purchase_cost ?? '',
        house_id: flock?.house_id ?? '',
        status: flock?.status ?? 'active',
        notes: flock?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/flocks/${flock.id}`) : post('/flocks');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Flock' : 'Add Flock'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/flocks" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Flock' : 'Add Flock'}</h2>
                </div>

                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Flock Name" name="name" required {...fp} />
                    <Field label="Batch Number" name="batch_no" required {...fp} />

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Bird Type" name="bird_type" options={[
                            { value: 'layer', label: 'Layer' },
                            { value: 'broiler', label: 'Broiler' },
                            { value: 'cockerel', label: 'Cockerel' },
                            { value: 'turkey', label: 'Turkey' },
                            { value: 'duck', label: 'Duck' },
                            { value: 'guinea_fowl', label: 'Guinea Fowl' },
                        ]} {...fp} />
                        <Field label="Breed" name="breed" {...fp} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Initial Qty" name="initial_quantity" type="number" required {...fp} />
                        <Field label="Current Qty" name="current_quantity" type="number" required {...fp} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Source" name="source" options={[
                            { value: 'purchased', label: 'Purchased' },
                            { value: 'hatched', label: 'Hatched' },
                            { value: 'gifted', label: 'Gifted' },
                            { value: 'transferred', label: 'Transferred' },
                        ]} {...fp} />
                        <Field label="Source Name" name="source_name" {...fp} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Arrival Date" name="arrival_date" type="date" required {...fp} />
                        <Field label="Age (weeks)" name="age_weeks" type="number" {...fp} />
                    </div>

                    <Field label="Purchase Cost (total)" name="purchase_cost" type="number" {...fp} />

                    {houses?.length > 0 && (
                        <Field label="Assign to House" name="house_id" options={[
                            { value: '', label: '— Not assigned —' },
                            ...houses.map(h => ({ value: h.id, label: h.name })),
                        ]} {...fp} />
                    )}

                    {isEdit && (
                        <Field label="Status" name="status" options={[
                            { value: 'active', label: 'Active' },
                            { value: 'sold', label: 'Sold' },
                            { value: 'depleted', label: 'Depleted' },
                            { value: 'deceased', label: 'Deceased' },
                        ]} {...fp} />
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update Flock' : 'Add Flock'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
