import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationCameraDevice from "../../../../../../models/organization.cameradevice.model";
import OrganizationZone from "../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";

export async function GET(request) {
  const authResult = await authMiddleware("orgUserToken", "camera", "read")(request);
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

    const [devices, total] = await Promise.all([
      OrganizationCameraDevice.find({ organizationId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: "zoneId",
          model: OrganizationZone,
          select: "zoneName zoneCode zoneType zoneStatus", // only essential fields
        }),
      OrganizationCameraDevice.countDocuments({ organizationId }),
    ]);

    return NextResponse.json({
      message: "Camera devices fetched successfully",
      totalCameraDevicesNumber: total,
      devicesData: devices,
        devicesDataPagination: {
        total: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching camera devices:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
