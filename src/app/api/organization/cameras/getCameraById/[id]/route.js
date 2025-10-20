import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationCameraDevice from "../../../../../../../models/organization.cameradevice.model";
import OrganizationZone from "../../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

export async function GET(request, { params }) {
  try {
    // Auth check
    const authResult = await authMiddleware("orgUserToken", "camera", "read")(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    // Fetch device with populated zone
    const device = await OrganizationCameraDevice.findById(id)
      .populate({
        path: "zoneId",
        model: OrganizationZone,
        select: "zoneName zoneCode zoneType zoneStatus", // only essential fields
      })
      .lean();

    if (!device) {
      return NextResponse.json({ error: "Camera device not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Camera device fetched successfully", deviceData: device }, { status: 200 });
  } catch (error) {
    console.error("Error fetching camera device:", error);
    return NextResponse.json({ error: "Failed to fetch camera device" }, { status: 500 });
  }
}
