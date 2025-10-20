import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationCameraDevice from "../../../../../../../models/organization.cameradevice.model";
import OrganizationZone from "../../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

export async function DELETE(request, { params }) {
  const authResult = await authMiddleware("orgUserToken", "camera", "delete")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;
  const { id } = await params;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid device ID." }, { status: 400 });
    }

    const device = await OrganizationCameraDevice.findOneAndDelete({
      _id: id,
      organizationId,
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found." }, { status: 404 });
    }

    // Remove device MAC from zone if it was assigned
    if (device.zoneId) {
      await OrganizationZone.findByIdAndUpdate(
        device.zoneId,
        { $pull: { installedDevices: device.deviceMAC } }
      );
    }

    return NextResponse.json(
      { message: "Camera device deleted successfully", deviceData: device },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting camera device:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
