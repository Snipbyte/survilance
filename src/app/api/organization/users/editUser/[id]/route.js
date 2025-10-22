import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../../models/organization.user.model";
import OrganizationUserRole from "../../../../../../../models/organization.userrole.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

export async function PUT(request, { params }) {
  const authResult = await authMiddleware("orgUserToken", "user", "update")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
  }

  try {
    await connectDB();
    const updates = await request.json();
    const { userFullName, userEmail, userPassword, userRole, userStatus } = updates;

    const updateData = {};

    if (userFullName) updateData.userFullName = userFullName;
    if (userEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
      }
      updateData.userEmail = userEmail;
    }
    if (userPassword) {
      updateData.userPassword = await bcrypt.hash(userPassword, 10);
    }
    if (userRole) updateData.userRole = userRole;
    if (userStatus) updateData.userStatus = userStatus;
   

    const updatedUser = await OrganizationUser.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updateData },
      { new: true }
    ).populate({
      path: "userRole",
      model: "OrganizationUserRole", // Explicitly specify the model
      select: "name", // Populate only the 'name' field
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", userData: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating org user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}