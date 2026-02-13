import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  });
}
