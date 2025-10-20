import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationCameraDevice from "../../../../../../models/organization.cameradevice.model";
import OrganizationZone from "../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";
import { isValidMacAddress } from "../../../../../../utils/validateMacAddress";

export async function POST(request) {
  const authResult = await authMiddleware("orgUserToken", "camera", "create")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId, userFullName } = authResult;

  try {
    await connectDB();
    const data = await request.json();

    const {
      zoneId,
      deviceName,
      deviceId,
      deviceType,
      deviceIP,
      deviceMAC,
      deviceResolution,
      deviceLocation,
      installationDate,
    } = data;

    // Required fields
    if (!deviceName || !deviceId || !deviceIP || !deviceMAC) {
      return NextResponse.json(
        { error: "deviceName, deviceId, deviceIP, and deviceMAC are required." },
        { status: 400 }
      );
    }

    // Validate MAC address format
    if (!isValidMacAddress(deviceMAC)) {
      return NextResponse.json({ error: "Invalid MAC address format." }, { status: 400 });
    }

    // Validate orgId
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json({ error: "Invalid organizationId." }, { status: 400 });
    }

    // Validate zoneId if provided
    if (zoneId && !mongoose.Types.ObjectId.isValid(zoneId)) {
      return NextResponse.json({ error: "Invalid zoneId." }, { status: 400 });
    }

    // If zoneId provided, ensure it exists and belongs to the organization
    if (zoneId) {
      const zone = await OrganizationZone.findOne({ _id: zoneId, organizationId });
      if (!zone) {
        return NextResponse.json({ error: "Zone not found or does not belong to the organization." }, { status: 404 });
      }
    }

    // Unique checks
    const existing = await OrganizationCameraDevice.findOne({
      $or: [
        { deviceId: deviceId.trim().toUpperCase() },
        { deviceMAC: deviceMAC.trim().toUpperCase() },
        { deviceIP: deviceIP.trim() },
        { deviceName: deviceName.trim() }
      ],
      organizationId
    });

    if (existing) {
      return NextResponse.json(
        { error: "A device with the same ID, MAC, IP, or Name already exists." },
        { status: 409 }
      );
    }

    // Create new device
    const newDevice = new OrganizationCameraDevice({
      organizationId,
      zoneId: zoneId || null,
      deviceName: deviceName.trim(),
      deviceId: deviceId.trim().toUpperCase(),
      deviceType: deviceType?.trim() || "surveillance",
      deviceIP: deviceIP.trim(),
      deviceMAC: deviceMAC.trim().toUpperCase(),
      deviceResolution: deviceResolution || "1920x1080",
      deviceLocation: deviceLocation || "",
      installationDate: installationDate || Date.now(),
      createdBy: userFullName || "system",
    });

    await newDevice.save();

    // If zone selected → append MAC to zone.installedDevices
    if (zoneId && mongoose.Types.ObjectId.isValid(zoneId)) {
      await OrganizationZone.findByIdAndUpdate(
        zoneId,
        { $addToSet: { installedDevices: deviceMAC.trim().toUpperCase() } },
        { new: true }
      );
    }

    return NextResponse.json(
      { message: "Camera device added successfully", deviceData: newDevice },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error adding camera device:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
