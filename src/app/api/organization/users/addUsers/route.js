import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";
import OrganizationUser from "../../../../../../models/organization.user.model";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { generateUserTag } from "../../../../../../utils/generateUserTag";
import { generateQuantumPasskey } from "../../../../../../utils/quantumPasskeyHelper";
import mongoose from "mongoose";

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

  const { organizationId } = authResult;

  try {
    await connectDB();
    const formData = await request.formData();
    const csvFile = formData.get("userRegistrationFile");

    if (!csvFile) {
      return NextResponse.json({ error: "CSV file is required." }, { status: 400 });
    }

    if (!csvFile.type.includes("csv")) {
      return NextResponse.json({ error: "Only CSV files are allowed." }, { status: 400 });
    }

    const csvText = await csvFile.text();
    const rows = csvText
      .split("\n")
      .map(r => r.trim())
      .filter(r => r !== "");

    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV file is empty or invalid." }, { status: 400 });
    }

    const headers = rows[0].split(",").map(h => h.trim());
    const requiredHeaders = ["Full Name", "Email"];

    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        return NextResponse.json({ error: `Missing required column: ${required}` }, { status: 400 });
      }
    }

    const users = rows.slice(1);
    let registered = 0;
    let skipped = [];
    let seenEmails = new Set();

    for (const row of users) {
      const cols = row.split(",").map(c => c.trim());
      if (cols.length !== headers.length) {
        skipped.push(`Skipped row: incorrect number of columns`);
        continue;
      }

      const userObj = {};
      headers.forEach((header, i) => {
        userObj[header] = cols[i];
      });

      const userFullName = userObj["Full Name"];
      const userEmail = userObj["Email"]?.toLowerCase();

      // Validate required fields
      if (!userFullName || !userEmail) {
        skipped.push(`Skipped: missing required fields`);
        continue;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        skipped.push(`Skipped ${userEmail}: invalid email format`);
        continue;
      }

      if (seenEmails.has(userEmail)) {
        skipped.push(`Skipped ${userEmail}: duplicate in CSV`);
        continue;
      }
      seenEmails.add(userEmail);

      // Check if already exists in DB
      const exists = await OrganizationUser.findOne({ organizationId, userEmail });
      if (exists) {
        skipped.push(`Skipped ${userEmail}: already exists`);
        continue;
      }

      // Generate password & userId
      const password = generateQuantumPasskey(10);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new OrganizationUser({
        organizationId,
        userFullName,
        userEmail,
        userId: generateUserTag(userEmail),
        userPassword: hashedPassword,
      });

      await newUser.save();
      await sendUserWelcomeEmail({ userFullName, userEmail, password });
      registered++;
    }

    return NextResponse.json(
      {
        message: `${registered} users registered successfully.`,
        errorData: skipped,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bulk user registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
