import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";
import { isPasswordGroovy } from "../../../../../../utils/passwordValidator";

export async function POST(request) {
  await connectDB();
  const { userEmail, code, newPassword } = await request.json();

  if (!userEmail || !code || !newPassword) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

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

  if (!isPasswordGroovy(newPassword)) {
    return NextResponse.json({ error: "Password does not meet complexity requirements." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.userPassword = hashed;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return NextResponse.json({ message: "Password reset successful." });
}
