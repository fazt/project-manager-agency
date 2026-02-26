'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/dashboard/header';

const settingsNav = [
  { name: 'Profile', href: '/dashboard/settings/profile' },
  { name: 'Subscription', href: '/dashboard/settings/subscription' },
  { name: 'Billing', href: '/dashboard/settings/billing' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <Header
        breadcrumb={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Settings', href: '/dashboard/settings' },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <nav className="p-4">
            <ul className="space-y-1">
              {settingsNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </>
  );
}
