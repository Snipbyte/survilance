import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";
import nodemailer from "nodemailer";
import { generateUserTag } from "../../../../../../utils/generateUserTag";


// --- EMAIL FUNCTION ---
async function sendUserWelcomeEmail({ userFullName, userEmail, password }) {
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
    subject: "Your Organization Account Credentials",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome, ${userFullName}!</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please change your password after your first login.</p>
        <p>Regards,<br/>The Team</p>
      </div>
    `,
  });
}

export async function POST(request) {
  const authResult = await authMiddleware("orgUserToken", "user", "create")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId, userFullName: createdBy } = authResult;

  try {
    await connectDB();
    const data = await request.json();
    const { userFullName, userEmail, userPassword, userRole, isPrimaryUser } = data;

    if (!userFullName || !userEmail || !userPassword) {
      return NextResponse.json({ error: "Full name, email, and password are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json({ error: "Invalid organization ID." }, { status: 400 });
    }

    const existingUser = await OrganizationUser.findOne({ organizationId, userEmail });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new OrganizationUser({
      organizationId,
      userFullName,
      userEmail,
      userId: generateUserTag(userFullName),
      userPassword: hashedPassword,
      userRole: userRole || null,
      isPrimaryUser: !!isPrimaryUser,
      createdBy,
    });

    await newUser.save();

    await sendUserWelcomeEmail({ userFullName, userEmail, password: userPassword });

    // Exclude password from response
    newUser.userPassword = undefined;

    return NextResponse.json({ message: "User created successfully", userData: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating org user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

