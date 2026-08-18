import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function FarmIndex({ farm }) {
    if (!farm) {
        return (
            <AppLayout title="Farm Setup">
                <div className="max-w-md mx-auto mt-10 text-center">
                    <span className="text-5xl">🏡</span>
                    <h2 className="text-xl font-bold text-gray-800 mt-4">No Farm Setup Yet</h2>
                    <p className="text-gray-500 mt-2">Create your farm profile to get started.</p>
                    <Link href="/farm/create" className="mt-5 inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800">
                        🏡 Create Farm
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const rows = [
        ['Farm Name', farm.name],
        ['Owner', farm.owner_name],
        ['Location', farm.location],
        ['Address', farm.address],
        ['Phone', farm.phone],
        ['Email', farm.email],
        ['Established', farm.established_date],
        ['Farm Type', farm.farm_type],
        ['Currency', farm.currency],
    ];

    return (
        <AppLayout title="Farm Setup">
            <div className="max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800">Farm Profile</h2>
                    <Link href={`/farm/${farm.id}/edit`} className="inline-flex items-center gap-1 bg-green-700 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-800">
                        ✏️ Edit
                    </Link>
                </div>

                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl p-5 mb-5 text-center">
                    <span className="text-5xl">🐓</span>
                    <h3 className="text-xl font-bold mt-2">{farm.name}</h3>
                    <p className="text-green-200 capitalize">{farm.farm_type?.replace('_', ' ')} Farm</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    {rows.filter(([, v]) => v).map(([label, value]) => (
                        <div key={label} className="flex justify-between px-4 py-3">
                            <span className="text-sm text-gray-500">{label}</span>
                            <span className="text-sm font-medium text-gray-800 capitalize">{value}</span>
                        </div>
                    ))}
                </div>

                {farm.notes && (
                    <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-sm text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{farm.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
