import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../../models/organization.user.model";
import OrganizationUserRole from "../../../../../../../models/organization.userrole.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";


export async function GET(request, { params }) {
  const authResult = await authMiddleware("orgUserToken", "user", "read")(request);
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
    const user = await OrganizationUser.findOne({ _id: id, organizationId })
      .populate({
        path: "userRole",
        model: "OrganizationUserRole", // Explicitly specify the model
        select: "name", // Populate only the 'name' field
      })
      .select("-userPassword");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "User details fetched successfully", userData: user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching org user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}