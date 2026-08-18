import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠', name: 'dashboard' },
    { href: '/farm', label: 'Farm Setup', icon: '🏡', name: 'farm' },
    { href: '/flocks', label: 'Flocks', icon: '🐔', name: 'flocks' },
    { href: '/egg-production', label: 'Egg Production', icon: '🥚', name: 'egg-production' },
    { href: '/sales', label: 'Sales', icon: '💰', name: 'sales' },
    { href: '/feed-expenses', label: 'Feed Expense', icon: '🌾', name: 'feed-expenses' },
    { href: '/feed-consumption', label: 'Feed Consumption', icon: '📊', name: 'feed-consumption' },
    { href: '/health', label: 'Vet & Health', icon: '💉', name: 'health' },
    { href: '/mortality', label: 'Mortality Log', icon: '📋', name: 'mortality' },
    { href: '/housing', label: 'Housing', icon: '🏘️', name: 'housing' },
    { href: '/equipment', label: 'Equipment', icon: '🔧', name: 'equipment' },
    { href: '/labour', label: 'Labour & Ops', icon: '👷', name: 'labour' },
];

// Bottom nav items (mobile - most used)
const bottomNavItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/flocks', label: 'Flocks', icon: '🐔' },
    { href: '/egg-production', label: 'Eggs', icon: '🥚' },
    { href: '/sales', label: 'Sales', icon: '💰' },
    { href: '/health', label: 'Health', icon: '💉' },
];

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUrl = window.location.pathname;

    const isActive = (href) => currentUrl.startsWith(href) && (href !== '/dashboard' || currentUrl === '/dashboard');

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white z-40 transform transition-transform duration-200
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-green-700">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl">🐓</span>
                        <div>
                            <p className="font-bold text-lg leading-tight">NestPro</p>
                            <p className="text-green-300 text-xs">Farm Manager</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-green-300 hover:text-white p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Nav links */}
                <nav className="py-2 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                ${isActive(item.href)
                                    ? 'bg-green-700 text-white font-semibold'
                                    : 'text-green-100 hover:bg-green-700/60'
                                }`}
                        >
                            <span className="text-base w-6 text-center">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="border-t border-green-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">
                            {auth?.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{auth?.user?.name}</p>
                            <p className="text-green-300 text-xs truncate">{auth?.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left text-xs text-green-300 hover:text-white px-1 py-1"
                    >
                        Sign out →
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center justify-between px-4 h-14">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {title && (
                                <h1 className="text-base font-semibold text-gray-800 truncate">{title}</h1>
                            )}
                        </div>
                        <Link
                            href="/profile"
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <span className="hidden sm:inline">{auth?.user?.name}</span>
                            <span>⚙️</span>
                        </Link>
                    </div>
                </header>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                        <span>✅</span> {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                        <span>❌</span> {flash.error}
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 p-4 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>

            {/* Mobile bottom navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 lg:hidden">
                <div className="flex">
                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors
                                ${isActive(item.href)
                                    ? 'text-green-700 font-semibold'
                                    : 'text-gray-500'
                                }`}
                        >
                            <span className="text-xl mb-0.5">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex-1 flex flex-col items-center justify-center py-2 text-xs text-gray-500"
                    >
                        <span className="text-xl mb-0.5">☰</span>
                        More
                    </button>
                </div>
            </nav>
        </div>
    );
}
