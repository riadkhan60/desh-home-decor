"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/admin-login");
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        router.push("/admin-login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isChecking, isAuthenticated };
}
