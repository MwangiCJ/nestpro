import { Link } from '@inertiajs/react';

export default function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span>/</span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-green-700">{item.label}</Link>
                    ) : (
                        <span className="text-gray-800 font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
