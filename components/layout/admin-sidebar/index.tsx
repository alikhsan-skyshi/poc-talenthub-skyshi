"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "KPI Dashboard",
    href: "/admin",
  },
  {
    label: "Manage User",
    href: "/admin/account",
  },
  {
    label: "Template Form",
    href: "/admin/template-form",
  },
  {
    label: "Profile",
    href: "/admin/profile",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TH</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Talent Hub</h1>
            <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            // For KPI Dashboard, also check if pathname is /admin/kpi
            const isActive =
              pathname === item.href ||
              (item.href === "/admin" && pathname === "/admin/kpi");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-700 hover:bg-light hover:text-primary"
                    }
                  `}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-100 bg-light">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.username}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full border-gray-200 hover:bg-white hover:border-primary hover:text-primary"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
