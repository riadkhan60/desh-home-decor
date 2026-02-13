"use server";

import { cookies } from "next/headers";
import { prisma } from "./prisma";

const ADMIN_SESSION_KEY = "admin_session";

// Simple admin credentials check (no password hashing for simplicity)
export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return null;
  }

  // Direct password comparison (no bcrypt for simplicity)
  if (admin.password !== password) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

export async function setAdminSession(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_KEY, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_KEY);
  
  if (!session?.value) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.value },
  });

  return admin;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_KEY);
}
