import { Link } from '@inertiajs/react';

export default function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between mb-5">
            <div>
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && (
                <Link
                    href={action.href}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 bg-green-700 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                    <span>+</span> {action.label}
                </Link>
            )}
        </div>
    );
}
