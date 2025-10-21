import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../../lib/mongodb";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";
import OrganizationUserRole from "../../../../../../../models/organization.userrole.model";

export async function DELETE(request, { params }) {
  const { id } = await params;

  const authResult = await authMiddleware("orgUserToken", "user", "delete")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;

  try {
    await connectDB();

    const deleted = await OrganizationUserRole.findOneAndDelete({ _id: id, organizationId });

    if (!deleted) {
      return NextResponse.json({ error: "User role not found or already deleted." }, { status: 404 });
    }

    return NextResponse.json({ message: "User role deleted successfully.", roleData: deleted }, { status: 200 });

  } catch (error) {
    console.error("Delete user role error:", error);
    return NextResponse.json({ error: "Failed to delete user role." }, { status: 500 });
  }
}
