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

export default function HealthForm({ record, flocks, defaultFlockId }) {
    const isEdit = !!record;
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, errors, processing } = useForm({
        flock_id: record?.flock_id ?? defaultFlockId ?? (flocks[0]?.id ?? ''),
        record_date: record?.record_date ?? today,
        record_type: record?.record_type ?? 'vaccination',
        disease_condition: record?.disease_condition ?? '',
        vaccine_drug_name: record?.vaccine_drug_name ?? '',
        dosage: record?.dosage ?? '',
        administration_route: record?.administration_route ?? 'oral',
        birds_affected: record?.birds_affected ?? '',
        vet_name: record?.vet_name ?? '',
        cost: record?.cost ?? '',
        next_due_date: record?.next_due_date ?? '',
        status: record?.status ?? 'done',
        notes: record?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/health/${record.id}`) : post('/health');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Health Record' : 'Add Health Record'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/health" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Health Record' : '💉 Add Health Record'}</h2>
                </div>

                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Flock" name="flock_id" options={flocks.map(f => ({ value: f.id, label: f.name }))} {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" name="record_date" type="date" {...fp} />
                        <Field label="Record Type" name="record_type" options={[
                            { value: 'vaccination', label: '💉 Vaccination' },
                            { value: 'treatment', label: '💊 Treatment' },
                            { value: 'deworming', label: '🔄 Deworming' },
                            { value: 'vitamin_supplement', label: '🟡 Vitamin/Supplement' },
                            { value: 'inspection', label: '🔍 Inspection' },
                            { value: 'biosecurity', label: '🛡️ Biosecurity' },
                        ]} {...fp} />
                    </div>
                    <Field label="Disease / Condition" name="disease_condition" {...fp} />
                    <Field label="Vaccine / Drug Name" name="vaccine_drug_name" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Dosage" name="dosage" {...fp} />
                        <Field label="Route" name="administration_route" options={[
                            { value: 'oral', label: 'Oral (Water)' },
                            { value: 'injection', label: 'Injection' },
                            { value: 'eye_drop', label: 'Eye Drop' },
                            { value: 'spray', label: 'Spray' },
                            { value: 'topical', label: 'Topical' },
                        ]} {...fp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Birds Affected" name="birds_affected" type="number" {...fp} />
                        <Field label="Cost (GH₵)" name="cost" type="number" {...fp} />
                    </div>
                    <Field label="Vet Name" name="vet_name" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Next Due Date" name="next_due_date" type="date" {...fp} />
                        <Field label="Status" name="status" options={[
                            { value: 'done', label: '✅ Done' },
                            { value: 'scheduled', label: '📅 Scheduled' },
                            { value: 'overdue', label: '⚠️ Overdue' },
                        ]} {...fp} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50">
                        {processing ? 'Saving…' : isEdit ? 'Update' : 'Save Record'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
