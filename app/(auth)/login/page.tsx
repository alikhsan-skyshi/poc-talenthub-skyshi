import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TH</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Talent Hub</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100 sm:px-10">
          <LoginForm />
        </div>
        <p className="text-center text-xs text-gray-500">
          Talent Acquisition Platform
        </p>
      </div>
    </div>
  );
}
