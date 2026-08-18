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

export default function EggProductionForm({ production, flocks, defaultFlockId }) {
    const isEdit = !!production;

    // Get today's date as default
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, errors, processing } = useForm({
        flock_id: production?.flock_id ?? defaultFlockId ?? (flocks[0]?.id ?? ''),
        production_date: production?.production_date ?? today,
        total_eggs: production?.total_eggs ?? '',
        whole_eggs: production?.whole_eggs ?? '',
        broken_eggs: production?.broken_eggs ?? '0',
        small_eggs: production?.small_eggs ?? '0',
        soiled_eggs: production?.soiled_eggs ?? '0',
        collected_by: production?.collected_by ?? '',
        notes: production?.notes ?? '',
    });

    // Auto-calculate total from components
    const calcTotal = () => {
        const w = parseInt(data.whole_eggs || 0);
        const b = parseInt(data.broken_eggs || 0);
        const s = parseInt(data.small_eggs || 0);
        const so = parseInt(data.soiled_eggs || 0);
        if (w || b || s || so) setData('total_eggs', String(w + b + s + so));
    };

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/egg-production/${production.id}`) : post('/egg-production');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Egg Log' : 'Log Eggs'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/egg-production" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Egg Log' : '🥚 Log Egg Production'}</h2>
                </div>

                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Flock" name="flock_id" options={flocks.map(f => ({ value: f.id, label: f.name }))} {...fp} />

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" name="production_date" type="date" {...fp} />
                        <Field label="Total Eggs" name="total_eggs" type="number" hint="Or fill breakdown below" {...fp} />
                    </div>

                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Egg Breakdown (optional)</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="🥚 Whole Eggs" name="whole_eggs" type="number" {...fp} />
                        <Field label="🔴 Broken Eggs" name="broken_eggs" type="number" {...fp} />
                        <Field label="🟡 Small Eggs" name="small_eggs" type="number" {...fp} />
                        <Field label="🟤 Soiled Eggs" name="soiled_eggs" type="number" {...fp} />
                    </div>
                    <button type="button" onClick={calcTotal} className="text-xs text-green-700 underline">
                        Auto-calculate total from breakdown
                    </button>

                    <Field label="Collected By" name="collected_by" {...fp} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update Log' : 'Save Egg Log'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
