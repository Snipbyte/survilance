import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";
import { generateCosmicResetCode } from "../../../../../../utils/generateCosmicResetCode";
import nodemailer from "nodemailer";

// --- EMAIL FUNCTION ---
async function sendResetCodeEmail({ userEmail, code }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Your Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>Your password reset code is:</p>
        <h3 style="color: #2e6c80;">${code}</h3>
        <p>This code will expire in 15 minutes.</p>
      </div>
    `,

  });
}

export async function POST(request) {
  await connectDB();
  const { userEmail } = await request.json();

  if (!userEmail) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await OrganizationUser.findOne({ userEmail });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const code = generateCosmicResetCode();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  user.resetPasswordToken = code;
  user.resetPasswordExpires = expiry;
  await user.save();

  await sendResetCodeEmail({ userEmail, code });

  return NextResponse.json({ message: "Reset code sent successfully." });
}
