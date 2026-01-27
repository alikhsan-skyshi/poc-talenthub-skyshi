import { useAuthStore } from "@/stores/auth-store";
import type { LoginCredentials } from "@/types/auth";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
    setLoading,
  } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    setUser,
    setLoading,
  };
};
