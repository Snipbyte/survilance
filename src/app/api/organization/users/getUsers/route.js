import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";
import OrganizationUserRole from "../../../../../../models/organization.userrole.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";

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
    const search = searchParams.get("search")?.trim() || "";

    const query = { organizationId };

    if (search) {
      query.$or = [
        { userFullName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
      ];
    }

    const total = await OrganizationUser.countDocuments(query);

    const users = await OrganizationUser.find(query)
      .select("-userPassword") // Exclude password
      .populate("userRole")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        totalUsersNumber: total,
        userData: users,
        usersDataPagination: {
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching org users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
