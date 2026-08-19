import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';

const Field = ({ label, name, type = 'text', options, required, data, setData, errors }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {options ? (
            <select
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        ) : (
            <input
                type={type}
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
        )}
        {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
);

export default function FarmForm({ farm }) {
    const isEdit = !!farm;
    const { data, setData, post, put, errors, processing } = useForm({
        name: farm?.name ?? '',
        owner_name: farm?.owner_name ?? '',
        location: farm?.location ?? '',
        address: farm?.address ?? '',
        phone: farm?.phone ?? '',
        email: farm?.email ?? '',
        established_date: farm?.established_date ?? '',
        farm_type: farm?.farm_type ?? 'layers',
        currency: farm?.currency ?? 'GHS',
        notes: farm?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/farm/${farm.id}`);
        } else {
            post('/farm');
        }
    };

    return (
        <AppLayout title={isEdit ? 'Edit Farm' : 'Create Farm'}>
            <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-5">{isEdit ? 'Edit Farm Profile' : '🏡 Set Up Your Farm'}</h2>
                <form onSubmit={submit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-4">
                    <Field label="Farm Name" name="name" required data={data} setData={setData} errors={errors} />
                    <Field label="Owner Name" name="owner_name" required data={data} setData={setData} errors={errors} />
                    <Field label="Farm Type" name="farm_type" data={data} setData={setData} errors={errors} options={[
                        { value: 'layer', label: 'Layers (Egg production)' },
                        { value: 'broiler', label: 'Broilers (Meat production)' },
                        { value: 'dual_purpose', label: 'Dual Purpose' },
                        { value: 'turkey', label: 'Turkey' },
                        { value: 'duck', label: 'Duck' },
                        { value: 'mixed', label: 'Mixed' },
                    ]} />
                    <Field label="Location / Town" name="location" required data={data} setData={setData} errors={errors} />
                    <Field label="Full Address" name="address" data={data} setData={setData} errors={errors} />
                    <Field label="Phone Number" name="phone" type="tel" data={data} setData={setData} errors={errors} />
                    <Field label="Email" name="email" type="email" data={data} setData={setData} errors={errors} />
                    <Field label="Established Date" name="established_date" type="date" data={data} setData={setData} errors={errors} />
                    <Field label="Currency" name="currency" data={data} setData={setData} errors={errors} options={[
                        { value: 'GHS', label: 'GHS – Ghana Cedi' },
                        { value: 'USD', label: 'USD – US Dollar' },
                        { value: 'NGN', label: 'NGN – Naira' },
                        { value: 'KES', label: 'KES – Kenyan Shilling' },
                        { value: 'ZAR', label: 'ZAR – Rand' },
                    ]} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50"
                    >
                        {processing ? 'Saving…' : isEdit ? 'Update Farm' : 'Create Farm'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
