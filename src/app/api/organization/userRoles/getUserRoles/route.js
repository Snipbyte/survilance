import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";
import OrganizationUserRole from "../../../../../../models/organization.userrole.model";

export async function GET(request) {
  const authResult = await authMiddleware("orgUserToken", "user", "read")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const total = await OrganizationUserRole.countDocuments({ organizationId });
    const roles = await OrganizationUserRole.find({ organizationId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      message: "User roles fetched successfully",
      totalUserRolesNumber: total,
      roleData: roles,
      roleDataPagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Get all user roles error:", error);
    return NextResponse.json({ error: "Failed to fetch user roles." }, { status: 500 });
  }
}
