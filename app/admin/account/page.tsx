"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { PencilIcon } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

export default function AdminAccountPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy account data
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
  ];

  const filteredAccounts = accounts.filter((account) => {
    return (
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
                {filteredAccounts.map((account) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
