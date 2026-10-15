"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  FileText,
  BriefcaseBusiness,
  Users,
  Newspaper,
  CalendarDays,
  Images,
  ChartNoAxesColumn,
  Phone,
  Settings,
  LogOut,
} from "lucide-react";

import { logout } from "@/actions/auth.actions";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero", href: "/admin/hero", icon: Image },
  { label: "About", href: "/admin/about", icon: FileText },
  { label: "Service", href: "/admin/services", icon: BriefcaseBusiness },
  { label: "Membership", href: "/admin/membership", icon: Users },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Event", href: "/admin/events", icon: CalendarDays },
  { label: "Media", href: "/admin/media", icon: Images },
  { label: "Statistics", href: "/admin/statistics", icon: ChartNoAxesColumn },
  { label: "Contact Info", href: "/admin/contact", icon: Phone },
  { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
];

type AdminSidebarProps = {
  admin: {
    name: string;
    email: string;
  };
};

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-b-0">
      {/* Logo */}
      <div className="border-b border-gray-100 px-6 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-orange-600 text-xl font-bold text-white shadow-sm">
            S
          </span>

          <span>
            <span className="block text-base font-bold tracking-tight text-gray-900">
              SBW Digital
            </span>
            <span className="block text-xs text-gray-500">
              Admin Dashboard
            </span>
          </span>
        </Link>
      </div>

      {/* Navigasi */}
      <nav
        aria-label="Navigasi admin"
        className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-y-auto"
      >
        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-orange-600" />
              )}

              <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profil admin */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700">
            {admin.name.trim().charAt(0).toUpperCase() || "A"}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {admin.name}
            </p>
            <p className="truncate text-xs text-gray-500">
              {admin.email}
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}