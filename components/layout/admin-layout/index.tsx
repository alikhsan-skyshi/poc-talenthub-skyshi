"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-light">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-light">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
