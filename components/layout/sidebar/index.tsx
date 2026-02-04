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
    label: "New Candidates",
    href: "/dashboard/new-candidates",
  },
  {
    label: "In Review",
    href: "/dashboard/my-candidate",
  },
  {
    label: "Approved",
    href: "/dashboard/approved",
  },
  {
    label: "Rejected",
    href: "/dashboard/rejected",
  },
  {
    label: "List of Candidates",
    href: "/dashboard/list-of-candidates",
  },
  {
    label: "Job Opening",
    href: "/dashboard/application-form",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
  },
];

// Split navigation items into two sections
const primaryNavItems = navItems.slice(0, 6); // Dashboard, New Candidates, In Review, Approved, Rejected, List of Candidates
const secondaryNavItems = navItems.slice(6); // Job Opening, Profile

export const Sidebar = () => {
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
            <h1 className="text-xl font-bold text-gray-900">Skyshi-Hub</h1>
            <p className="text-xs text-gray-500 mt-0.5">Talent Acquisition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Primary Section: Candidate Applications */}
        <div className="mb-2">
          <h3 className="px-4 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Candidate Applications
          </h3>
        </div>
        <ul className="space-y-1 mb-4">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href;
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

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Secondary Section: Job Opening, Feedback Template, Profile */}
        <div className="mb-2">
          <h3 className="px-4 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            Others
          </h3>
        </div>
        <ul className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
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
