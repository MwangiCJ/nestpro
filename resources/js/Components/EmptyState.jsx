export default function EmptyState({ icon = '📭', title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>}
            {action && (
                <a
                    href={action.href}
                    className="mt-4 inline-flex items-center gap-1.5 bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800"
                >
                    + {action.label}
                </a>
            )}
        </div>
    );
}
