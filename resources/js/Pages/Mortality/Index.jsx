import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

const causeColors = {
    disease: 'bg-red-100 text-red-700',
    injury: 'bg-orange-100 text-orange-700',
    culling: 'bg-gray-100 text-gray-600',
    predator: 'bg-purple-100 text-purple-700',
    unknown: 'bg-amber-100 text-amber-700',
    suffocation: 'bg-blue-100 text-blue-700',
};

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

function MortalityFormInline({ logs, flocks }) {
    const today = new Date().toISOString().split('T')[0];
    const { data, setData, post, errors, processing, reset } = useForm({
        flock_id: flocks[0]?.id ?? '',
        log_date: today,
        quantity: '',
        cause: 'unknown',
        specific_cause: '',
        disposal_method: 'buried',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/mortality', { onSuccess: () => reset() });
    };

    const fp = { data, setData, errors };

    return (
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-4 mb-5 space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">📉 Log Mortality</h3>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Flock" name="flock_id" options={flocks.map(f => ({ value: f.id, label: f.name }))} {...fp} />
                <Field label="Date" name="log_date" type="date" {...fp} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Field label="No. of Birds" name="quantity" type="number" {...fp} />
                <Field label="Cause" name="cause" options={[
                    { value: 'disease', label: '🦠 Disease' },
                    { value: 'injury', label: '🩹 Injury' },
                    { value: 'culling', label: '✂️ Culling' },
                    { value: 'predator', label: '🦊 Predator' },
                    { value: 'suffocation', label: '😮‍💨 Suffocation' },
                    { value: 'unknown', label: '❓ Unknown' },
                    { value: 'other', label: '📋 Other' },
                ]} {...fp} />
            </div>
            <Field label="Specific Cause / Details" name="specific_cause" {...fp} />
            <Field label="Disposal Method" name="disposal_method" options={[
                { value: 'buried', label: 'Buried' },
                { value: 'burned', label: 'Burned' },
                { value: 'composted', label: 'Composted' },
                { value: 'sold', label: 'Sold' },
                { value: 'other', label: 'Other' },
            ]} {...fp} />
            <button type="submit" disabled={processing}
                className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 text-sm">
                {processing ? 'Saving…' : 'Record Mortality'}
            </button>
        </form>
    );
}

export default function MortalityIndex({ logs: logsProp, flocks, monthTotal }) {
    const logs = logsProp?.data ?? logsProp ?? [];
    const fmt = n => Number(n ?? 0).toLocaleString();

    const confirmDelete = (id) => {
        if (confirm('Delete this mortality log?')) router.delete(`/mortality/${id}`);
    };

    return (
        <AppLayout title="Mortality Log">
            <PageHeader title="Mortality Log" subtitle={monthTotal ? `${fmt(monthTotal)} deaths this month` : ''} />

            {monthTotal !== undefined && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center mb-4">
                    <p className="text-2xl font-bold text-red-700">{fmt(monthTotal)}</p>
                    <p className="text-xs text-gray-500">Deaths This Month</p>
                </div>
            )}

            {flocks.length > 0 && <MortalityFormInline flocks={flocks} logs={logs} />}

            {logs.length === 0 ? (
                <EmptyState icon="📋" title="No mortality logs" description="Mortality records will appear here." />
            ) : (
                <div className="space-y-3">
                    {logs.map(log => (
                        <div key={log.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{log.flock?.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${causeColors[log.cause] ?? 'bg-gray-100'}`}>{log.cause}</span>
                                        <span className="text-xs text-gray-400">{log.log_date}</span>
                                    </div>
                                    {log.specific_cause && <p className="text-xs text-gray-500 mt-0.5">{log.specific_cause}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-600">{fmt(log.quantity)}</p>
                                    <p className="text-xs text-gray-400">birds</p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>Disposal: {log.disposal_method || '—'}</span>
                                <div className="flex gap-3">
                                    <Link href={`/mortality/${log.id}/edit`} className="text-amber-600 hover:underline">Edit</Link>
                                    <button onClick={() => confirmDelete(log.id)} className="text-red-500 hover:underline">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
