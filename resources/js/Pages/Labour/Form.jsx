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

export default function LabourForm({ record }) {
    const isEdit = !!record;
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, errors, processing } = useForm({
        worker_name: record?.worker_name ?? '',
        worker_role: record?.worker_role ?? '',
        task: record?.task ?? '',
        work_date: record?.work_date ?? today,
        hours_worked: record?.hours_worked ?? '',
        rate_per_hour: record?.rate_per_hour ?? '',
        total_pay: record?.total_pay ?? '',
        payment_status: record?.payment_status ?? 'paid',
        notes: record?.notes ?? '',
    });

    const calcPay = () => {
        if (data.hours_worked && data.rate_per_hour) {
            setData('total_pay', (parseFloat(data.hours_worked) * parseFloat(data.rate_per_hour)).toFixed(2));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        isEdit ? put(`/labour/${record.id}`) : post('/labour');
    };

    const fp = { data, setData, errors };

    return (
        <AppLayout title={isEdit ? 'Edit Labour Record' : 'Add Labour Record'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-5">
                    <Link href="/labour" className="text-sm text-gray-500">← Back</Link>
                    <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Labour Record' : '👷 Add Labour Record'}</h2>
                </div>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Worker Name" name="worker_name" {...fp} />
                        <Field label="Role" name="worker_role" {...fp} />
                    </div>
                    <Field label="Task / Description" name="task" {...fp} />
                    <Field label="Work Date" name="work_date" type="date" {...fp} />
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Hours Worked" name="hours_worked" type="number" {...fp} />
                        <Field label="Rate per Hour (GH₵)" name="rate_per_hour" type="number" {...fp} />
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Field label="Total Pay (GH₵)" name="total_pay" type="number" {...fp} />
                        </div>
                        <button type="button" onClick={calcPay} className="mb-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-2.5 rounded-lg">Calc</button>
                    </div>
                    <Field label="Payment Status" name="payment_status" options={[
                        { value: 'paid', label: '✅ Paid' },
                        { value: 'pending', label: '🟡 Pending' },
                        { value: 'partial', label: '🔵 Partial' },
                    ]} {...fp} />
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
