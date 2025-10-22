import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationUser from "../../../../../../models/organization.user.model";
import Organization from "../../../../../../models/organization.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";
import OrganizationUserRole from "../../../../../../models/organization.userrole.model";

export async function GET(request) {
  // Authenticate and authorize
  const authResult = await authMiddleware("orgUserToken", "profileOwn", "read")(request);

  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  try {
    await connectDB();

    const userId = authResult._id;

    // Fetch fresh user data from DB (in case profile changed after login)
    const user = await OrganizationUser.findById(userId)
      .populate("organizationId")
      .populate({
        path: "userRole",
        model: "OrganizationUserRole", // Explicitly specify the model
        select: "name permissions", // Populate 'name' and 'permissions'
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Shape the response cleanly
    const responsePayload = {
      _id: user._id,
      userId: user.userId,
      userFullName: user.userFullName,
      userEmail: user.userEmail,
      isPrimaryUser: user.isPrimaryUser,
      isUserVerified: user.isUserVerified,
      userStatus: user.userStatus,
      organization: {
        _id: user.organizationId._id,
        organizationName: user.organizationId.organizationName,
        organizationType: user.organizationId.organizationType,
        organizationContactEmail: user.organizationId.organizationContactEmail,
        organizationContactPhone: user.organizationId.organizationContactPhone,
      },
      role: user.userRole?.name || (user.isPrimaryUser ? "Primary Admin" : "Standard User"),
      permissions: user.userRole?.permissions || authResult.permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };

    return NextResponse.json({ user: responsePayload }, { status: 200 });
  } catch (error) {
    console.error("GET /organization/auth/me error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the profile." },
      { status: 500 }
    );
  }
}
