"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:px-6">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the admin panel
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg border bg-background px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring sm:h-12"
                  placeholder="admin@shilpini.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg border bg-background px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring sm:h-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50 sm:h-12"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground sm:text-sm">
          Default: admin@shilpini.com / admin123
        </p>
      </div>
    </div>
  );
}
