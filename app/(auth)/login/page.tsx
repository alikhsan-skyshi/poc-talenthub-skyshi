import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Talent Hub</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <LoginForm />
        </div>
        <p className="text-center text-xs text-gray-500">
          Talent Acquisition Platform
        </p>
      </div>
    </div>
  );
}
