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
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Application Form",
    href: "/dashboard/application-form",
  },
  {
    label: "My Candidate",
    href: "/dashboard/my-candidate",
  },
  {
    label: "Feedback Messaging",
    href: "/dashboard/feedback-messaging",
  },
  {
    label: "Archive",
    href: "/dashboard/archive",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Talent Hub</h1>
        <p className="text-xs text-gray-500 mt-1">Talent Acquisition</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || user?.username}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
