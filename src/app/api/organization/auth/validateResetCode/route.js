import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";

export async function POST(request) {
  await connectDB();
  const { userEmail, code } = await request.json();

  const user = await OrganizationUser.findOne({ userEmail });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  if (
    !user.resetPasswordToken ||
    user.resetPasswordToken !== code ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired reset code." }, { status: 400 });
  }

  return NextResponse.json({ message: "Code is valid." });
}
