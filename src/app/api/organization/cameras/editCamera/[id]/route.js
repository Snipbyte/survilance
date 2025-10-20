import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationCameraDevice from "../../../../../../../models/organization.cameradevice.model";
import OrganizationZone from "../../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";
import { isValidMacAddress } from "../../../../../../../utils/validateMacAddress";

export async function PUT(request, { params }) {
  const authResult = await authMiddleware("orgUserToken", "camera", "update")(request);
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

    const body = await request.json();
    const { zoneId, ...updateFields } = body;

    // Allowed fields to update
    const allowedFields = [
      "deviceName",
      "deviceType",
      "deviceIP",
      "deviceResolution",
      "deviceLocation",
      "isDeviceActive",
      "deviceStatus",
      "lastMaintenanceDate",
    ];

    // Reject any disallowed fields
    const invalidFields = Object.keys(updateFields).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: `The following fields cannot be updated: ${invalidFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // If MAC is somehow included, block or validate (here, we block to be strict)
    if (updateFields.deviceMAC || updateFields.deviceId || updateFields.organizationId) {
      return NextResponse.json(
        { error: "deviceMAC, deviceId, and organizationId cannot be updated." },
        { status: 400 }
      );
    }

    // Check if device exists under this org
    const existingDevice = await OrganizationCameraDevice.findOne({
      _id: id,
      organizationId,
    });

    if (!existingDevice) {
      return NextResponse.json({ error: "Device not found." }, { status: 404 });
    }

    // Handle zone reassignment logic if zoneId changed
    if (zoneId && zoneId !== String(existingDevice.zoneId)) {
      // Remove MAC from old zone
      if (existingDevice.zoneId) {
        await OrganizationZone.findByIdAndUpdate(
          existingDevice.zoneId,
          { $pull: { installedDevices: existingDevice.deviceMAC } }
        );
      }
      // Add MAC to new zone
      if (mongoose.Types.ObjectId.isValid(zoneId)) {
        await OrganizationZone.findByIdAndUpdate(
          zoneId,
          { $addToSet: { installedDevices: existingDevice.deviceMAC } }
        );
      }
    }

    // Update device
    const updatedDevice = await OrganizationCameraDevice.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateFields,
          zoneId: zoneId || null,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Camera device updated successfully", deviceData: updatedDevice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating camera device:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
