import { useMemo } from "react";
import { useAuth } from "./useAuth";

export const useRoleRedirect = () => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return "/login";
    return {
      admin: "/admin",
      manager: "/manager",
      employee: "/employee"
    }[user.role];
  }, [user]);
};
