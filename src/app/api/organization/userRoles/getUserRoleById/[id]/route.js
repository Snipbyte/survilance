import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../../lib/mongodb";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";
import OrganizationUserRole from "../../../../../../../models/organization.userrole.model";

export async function GET(request, { params }) {
  const { id } = await params;

  const authResult = await authMiddleware("orgUserToken", "user", "read")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;

  try {
    await connectDB();

    const role = await OrganizationUserRole.findOne({ _id: id, organizationId });

    if (!role) {
      return NextResponse.json({ error: "Role not found or access denied." }, { status: 404 });
    }

    return NextResponse.json({ message: "User role fetched successfully", roleData: role }, { status: 200 });
  } catch (error) {
    console.error("Get user role error:", error);
    return NextResponse.json({ error: "Failed to fetch user role." }, { status: 500 });
  }
}
