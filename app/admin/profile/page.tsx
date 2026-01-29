"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "A";
  };

  const handleSaveProfile = () => {
    // TODO: Implement save profile logic
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // TODO: Implement change password logic
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account information
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-semibold">
                {getUserInitial()}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                  {user?.role || "admin"}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="primary" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Change Password
          </h2>
          <div className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="primary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
