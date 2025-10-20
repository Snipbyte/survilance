import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../../models/organization.user.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

export async function DELETE(request, { params }) {
  const authResult = await authMiddleware("orgUserToken", "user", "delete")(request);
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
    const primaryUser = await OrganizationUser.findOne({ _id: id, organizationId, isPrimaryUser: true });
    if (primaryUser) {
      return NextResponse.json({ error: "Primary users cannot be deleted." }, { status: 403 });
    }

    const deleted = await OrganizationUser.findOneAndDelete({ _id: id, organizationId });

    if (!deleted) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Exclude password from response
    deleted.userPassword = undefined;

    return NextResponse.json({ message: "User deleted successfully", userData: deleted }, { status: 200 });
  } catch (error) {
    console.error("Error deleting org user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
