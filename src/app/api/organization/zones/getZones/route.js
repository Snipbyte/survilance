import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationZone from "../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";

export async function GET(request) {
  // Authenticate and authorize user
  const authResult = await authMiddleware("orgUserToken", "zone", "read")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Optional search by zoneName or zoneCode
    const search = searchParams.get("search")?.trim() || "";
    const searchFilter = search
      ? {
          $or: [
            { zoneName: { $regex: search, $options: "i" } },
            { zoneCode: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Final query filter
    const query = {
      organizationId,
      ...searchFilter,
    };

    // Get total count for pagination
    const totalZones = await OrganizationZone.countDocuments(query);

    // Fetch paginated zones
    const zones = await OrganizationZone.find(query)
      .select("-__v")
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    // Build response with pagination metadata
    return NextResponse.json(
      {
        message: "Zones fetched successfully",
        totalZonesDataNumber: totalZones,
        zonesData: zones,
        zonesDataPagination: {
          total: totalZones,
          page,
          limit,
          totalPages: Math.ceil(totalZones / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching zones:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
