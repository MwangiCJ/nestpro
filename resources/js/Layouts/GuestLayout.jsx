import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4 py-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center gap-2">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
                        <ApplicationLogo className="h-10 w-10 fill-current text-indigo-600" />
                    </span>
                </Link>

                <div className="mt-6 w-full max-w-md overflow-hidden rounded-2xl bg-white/90 px-6 py-8 shadow-xl ring-1 ring-gray-900/5 backdrop-blur sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
