import ApplicationLogo from '@/Components/ApplicationLogo';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-stone-50 lg:grid lg:grid-cols-2">
                {/* Brand / hero panel */}
                <div className="relative hidden overflow-hidden bg-emerald-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
                        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-emerald-500/20 blur-3xl" />
                        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
                        <svg
                            className="absolute inset-0 h-full w-full opacity-[0.07]"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <pattern
                                    id="nestpro-grid"
                                    width="32"
                                    height="32"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path
                                        d="M32 0H0V32"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="0.5"
                                    />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#nestpro-grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                                <ApplicationLogo className="h-8 w-8" />
                            </span>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                NestPro
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <h2 className="text-4xl font-bold leading-tight text-white">
                            Smarter management for your poultry farm
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-emerald-100/80">
                            Track flocks, production, feed, health, and sales in one place
                            so you can make better decisions every day.
                        </p>

                        <ul className="mt-10 space-y-4">
                            {[
                                {
                                    title: 'Flock & production tracking',
                                    desc: 'Monitor bird counts, egg production, and mortality with clear records.',
                                },
                                {
                                    title: 'Feed, health & expenses',
                                    desc: 'Keep feed usage, treatments, and farm costs organized and easy to review.',
                                },
                                {
                                    title: 'Sales & performance insights',
                                    desc: 'See what’s working across your operation and grow with confidence.',
                                },
                            ].map((item) => (
                                <li key={item.title} className="flex gap-3">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 ring-1 ring-amber-300/30">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="h-3.5 w-3.5"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.704 5.29a1 1 0 010 1.415l-7.2 7.25a1 1 0 01-1.42.003L3.296 9.17a1 1 0 111.408-1.42l3.075 3.05 6.495-6.54a1 1 0 011.43.03z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-white">
                                            {item.title}
                                        </span>
                                        <span className="block text-sm text-emerald-100/70">
                                            {item.desc}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative z-10 flex items-center gap-6 text-sm text-emerald-100/60">
                        <span>Poultry farm management</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-100/30" />
                        <span>Records, insights & control</span>
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-6 lg:px-16 xl:px-24">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
                                    <ApplicationLogo className="h-7 w-7" />
                                </span>
                                <span className="text-xl font-bold tracking-tight text-stone-900">
                                    NestPro
                                </span>
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-8">
                                <p className="text-sm font-medium text-amber-700">
                                    Welcome back
                                </p>
                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                                    Sign in to your farm
                                </h1>
                                
                            </div>

                            {status && (
                                <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{status}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-stone-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative mt-1.5">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                                />
                                            </svg>
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            autoFocus
                                            placeholder="you@example.com"
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="block w-full rounded-xl border-stone-300 bg-white py-2.5 pl-11 pr-3.5 text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-stone-700"
                                        >
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium text-emerald-700 hover:text-emerald-800 focus:outline-none focus:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative mt-1.5">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                                />
                                            </svg>
                                        </span>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            onChange={(e) =>
                                                setData('password', e.target.value)
                                            }
                                            className="block w-full rounded-xl border-stone-300 bg-white py-2.5 pl-11 pr-3.5 text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex cursor-pointer items-center gap-2.5">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData('remember', e.target.checked)
                                            }
                                            className="rounded border-stone-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-stone-600">
                                            Remember me for 30 days
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="h-4 w-4 animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                />
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </form>
                        </div>

                        <p className="mt-6 text-center text-xs text-stone-500">
                            Poultry farm management, simplified with NestPro.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
