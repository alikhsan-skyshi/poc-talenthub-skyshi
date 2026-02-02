"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditAccountPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dummy account data - in production, fetch from API
  useEffect(() => {
    // Simulate fetching account data
    const dummyAccounts: Record<string, { name: string; email: string }> = {
      "1": {
        name: "John Doe",
        email: "recruiter1@skyshi-hub.com",
      },
      "2": {
        name: "Jane Smith",
        email: "recruiter2@skyshi-hub.com",
      },
      "3": {
        name: "Admin User",
        email: "admin@skyshi-hub.com",
      },
      "4": {
        name: "Bob Johnson",
        email: "recruiter3@skyshi-hub.com",
      },
    };

    const account = dummyAccounts[accountId];
    if (account) {
      setName(account.name);
      setEmail(account.email);
    }
  }, [accountId]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to update account
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Account updated successfully!");
      router.push("/admin/account");
    } catch (error) {
      alert("Failed to update account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this account?")) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to deactivate account
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert("Account deactivated successfully!");
      router.push("/admin/account");
    } catch (error) {
      alert("Failed to deactivate account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/account")}
            className="mb-4"
          >
            ← Back to Accounts
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Account</h1>
          <p className="text-sm text-gray-600 mt-1">
            Update user account information
          </p>
        </div>

        {/* Account Information Form */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="space-y-4">
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Leave blank if you don&apos;t want to change the password
              </p>

              <div className="space-y-4">
                <Input
                  type="password"
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isLoading}
              >
                Save Changes
              </Button>
              <Button
                variant="danger"
                onClick={handleDeactivate}
                isLoading={isLoading}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
