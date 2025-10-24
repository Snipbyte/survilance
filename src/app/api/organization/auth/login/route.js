import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";
import Organization from "../../../../../../models/organization.model";
import OrganizationUserRole from "../../../../../../models/organization.userrole.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const ALL_RESOURCES = [
  "organization", "user", "role", "device", "settings",
  "profileOwn", "profileAny", "passwordOwn", "passwordAny",
  "notification", "report", "alert", "logs", "zone", "camera", "analytics", "dashboard", "settings"
];

const ALL_PERMISSIONS = ["create", "read", "update", "delete"];


export async function POST(request) {
  try {
    const { emailOrUserId, password } = await request.json();

    if (!emailOrUserId || !password) {
      return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
    }

    await connectDB();

    // Find user by email or userId
    const user = await OrganizationUser.findOne({
      $or: [
        { userEmail: emailOrUserId.toLowerCase().trim() },
        { userId: emailOrUserId.trim() }
      ]
    })
      .populate({
        path: "userRole",
        model: "OrganizationUserRole", // Explicitly specify the model
        select: "name permissions", // Populate 'name' and 'permissions'
      })
      .populate("organizationId");

    if (!user) {
      return NextResponse.json({ error: "Invalid email/user ID or password." }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.userPassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email/user ID or password." }, { status: 401 });
    }
if (user.userStatus.toLowerCase() !== "active") {
  return NextResponse.json({ error: `User account is ${user.userStatus}.` }, { status: 403 });
}

    if (!user.isUserVerified) {
      return NextResponse.json({ error: "User email is not verified." }, { status: 403 });
    }

    if (!user.organizationId || user.organizationId.organizationStatus !== "active") {
      return NextResponse.json({ error: "Associated organization is not active." }, { status: 403 });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Determine role data
    let roleData = null;

    if (user.userRole) {
      // Role assigned in DB
      roleData = {
        name: user.userRole.name,
        permissions: user.userRole.permissions, // Structured: [{resource, permission: []}]
      };
    } else if (user.isPrimaryUser) {
      // Grant full access to primary user
      roleData = {
        name: "Primary Admin",
        permissions: ALL_RESOURCES.map(resource => ({
          resource,
          permission: [...ALL_PERMISSIONS],
        })),
      };
    } else {
      // Standard sub-user with no role
      roleData = {
        name: "Standard User",
        permissions: [],
      };
    }

    // Create JWT payload
    const payload = {
      _id: user._id,
      userId: user.userId,
      userFullName: user.userFullName,
      userEmail: user.userEmail,
      organizationId: user.organizationId._id,
      organizationName: user.organizationId.organizationName,
      isPrimaryUser: user.isPrimaryUser,
      isUserVerified: user.isUserVerified,
      userStatus: user.userStatus,
      role: roleData.name,
      permissions: roleData.permissions,
      roleType: "OrganizationUser",
      lastLogin: user.lastLogin,
    };

    console.log("Login Payload:", payload);

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });

    // Prepare response
    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );

    response.cookies.set("orgUserToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  } catch (error) {
    console.error("Organization Login Error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}