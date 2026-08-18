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

export default function MortalityEdit({ log: record, flocks }) {
    const { data, setData, put, errors, processing } = useForm({
        flock_id: record.flock_id,
        log_date: record.log_date,
        quantity: record.quantity,
        cause: record.cause,
        specific_cause: record.specific_cause ?? '',
        disposal_method: record.disposal_method ?? 'buried',
        notes: record.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/mortality/${record.id}`);
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title="Edit Mortality Log">
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/mortality" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">Edit Mortality Log</h2>
                </div>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Flock" name="flock_id" options={flocks.map(f => ({ value: f.id, label: f.name }))} {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" name="log_date" type="date" {...fp} />
                        <Field label="No. of Birds" name="quantity" type="number" {...fp} />
                    </div>
                    <Field label="Cause" name="cause" options={[
                        { value: 'disease', label: '🦠 Disease' },
                        { value: 'injury', label: '🩹 Injury' },
                        { value: 'culling', label: '✂️ Culling' },
                        { value: 'predator', label: '🦊 Predator' },
                        { value: 'suffocation', label: '😮‍💨 Suffocation' },
                        { value: 'unknown', label: '❓ Unknown' },
                        { value: 'other', label: '📋 Other' },
                    ]} {...fp} />
                    <Field label="Specific Cause" name="specific_cause" {...fp} />
                    <Field label="Disposal Method" name="disposal_method" options={[
                        { value: 'buried', label: 'Buried' },
                        { value: 'burned', label: 'Burned' },
                        { value: 'composted', label: 'Composted' },
                        { value: 'sold', label: 'Sold' },
                        { value: 'other', label: 'Other' },
                    ]} {...fp} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : 'Update'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
