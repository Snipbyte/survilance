import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationZone from "../../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

// Update Zone
export async function PUT(request, { params }) {
  // Authenticate and authorize
  const authResult = await authMiddleware("orgUserToken", "zone", "update")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId, userFullName } = authResult;
  const { id } = params;

  try {
    await connectDB();

    // Validate Zone ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Zone ID format." }, { status: 400 });
    }

    const data = await request.json();
    const {
      zoneName,
      zoneCode,
      zoneDescription,
      zoneType,
      coordinates,
      isZoneActive,
      zoneStatus,
    } = data;

    // Ensure at least one field is provided
    if (!zoneName && !zoneCode && !zoneDescription && !zoneType && !coordinates && !zoneStatus && isZoneActive === undefined) {
      return NextResponse.json({ error: "No fields provided to update." }, { status: 400 });
    }

    // Validate unique zoneCode if updating
    if (zoneCode) {
      const existingZone = await OrganizationZone.findOne({
        zoneCode: zoneCode.trim().toUpperCase(),
        organizationId,
        _id: { $ne: id },
      });

      if (existingZone) {
        return NextResponse.json(
          { error: "Another zone with this zoneCode already exists for this organization." },
          { status: 409 }
        );
      }
    }

    // Validate coordinates if provided
    let validCoordinates = undefined;
    if (Array.isArray(coordinates)) {
      validCoordinates = coordinates.filter(
        (c) =>
          typeof c.lat === "number" &&
          typeof c.lng === "number" &&
          !isNaN(c.lat) &&
          !isNaN(c.lng)
      );

      if (validCoordinates.length !== coordinates.length) {
        return NextResponse.json(
          { error: "Invalid coordinates format. Each must have valid lat & lng numbers." },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateData = {};
    if (zoneName) updateData.zoneName = zoneName.trim();
    if (zoneCode) updateData.zoneCode = zoneCode.trim().toUpperCase();
    if (zoneDescription !== undefined) updateData.zoneDescription = zoneDescription.trim();
    if (zoneType) updateData.zoneType = zoneType;
    if (validCoordinates !== undefined) updateData.coordinates = validCoordinates;
    if (isZoneActive !== undefined) updateData.isZoneActive = isZoneActive;
    if (zoneStatus) updateData.zoneStatus = zoneStatus;
    updateData.updatedBy = userFullName || "system";

    const updatedZone = await OrganizationZone.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedZone) {
      return NextResponse.json({ error: "Zone not found or not authorized." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Zone updated successfully", zoneData: updatedZone },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating zone:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
