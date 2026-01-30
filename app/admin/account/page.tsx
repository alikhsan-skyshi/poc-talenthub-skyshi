"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { PencilIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function AdminAccountPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy account data - 10 users
  const accounts = [
    {
      id: "1",
      email: "recruiter1@talenthub.com",
      name: "John Doe",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      email: "recruiter2@talenthub.com",
      name: "Jane Smith",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      email: "admin@talenthub.com",
      name: "Admin User",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "4",
      email: "recruiter3@talenthub.com",
      name: "Bob Johnson",
      status: "inactive",
      createdAt: "2024-02-01",
    },
    {
      id: "5",
      email: "recruiter4@talenthub.com",
      name: "Alice Williams",
      status: "active",
      createdAt: "2024-02-05",
    },
    {
      id: "6",
      email: "recruiter5@talenthub.com",
      name: "Charlie Brown",
      status: "active",
      createdAt: "2024-02-10",
    },
    {
      id: "7",
      email: "recruiter6@talenthub.com",
      name: "Diana Prince",
      status: "inactive",
      createdAt: "2024-02-15",
    },
    {
      id: "8",
      email: "recruiter7@talenthub.com",
      name: "Edward Norton",
      status: "active",
      createdAt: "2024-02-20",
    },
    {
      id: "9",
      email: "recruiter8@talenthub.com",
      name: "Fiona Green",
      status: "active",
      createdAt: "2024-02-25",
    },
    {
      id: "10",
      email: "recruiter9@talenthub.com",
      name: "George Miller",
      status: "inactive",
      createdAt: "2024-03-01",
    },
  ];

  // Filter accounts based on search query
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      return (
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAccounts.slice(startIndex, endIndex);
  }, [filteredAccounts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (accountId: string) => {
    router.push(`/admin/account/${accountId}/edit`);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="primary">Create Account</Button>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  paginatedAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-light transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {account.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            account.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center">
                          <IconButton
                            icon={<PencilIcon />}
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(account.id)}
                            tooltip="Edit Account"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div className="border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
