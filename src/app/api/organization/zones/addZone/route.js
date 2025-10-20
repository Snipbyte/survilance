import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../lib/mongodb";
import OrganizationZone from "../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";

export async function POST(request) {
  // Authenticate and authorize user
  const authResult = await authMiddleware("orgUserToken", "zone", "create")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;

  try {
    await connectDB();
    const data = await request.json();

    const {
      zoneName,
      zoneCode,
      zoneDescription,
      zoneType,
      coordinates,
      // installedDevices
    } = data;

    // Required fields check
    if (!zoneName || !zoneCode) {
      return NextResponse.json(
        { error: "zoneName and zoneCode are required." },
        { status: 400 }
      );
    }

    // Validate organizationId format
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json(
        { error: "Invalid organizationId format." },
        { status: 400 }
      );
    }

    // Check unique zoneCode (case-insensitive)
    const existingZone = await OrganizationZone.findOne({
      zoneCode: zoneCode.toUpperCase().trim(),
      organizationId: organizationId,
    });

    if (existingZone) {
      return NextResponse.json(
        { error: "Zone with this zoneCode already exists for this organization." },
        { status: 409 }
      );
    }

    // Optional coordinates validation
    let validCoordinates = [];
    if (Array.isArray(coordinates) && coordinates.length > 0) {
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

    // Create new zone
    const newZone = new OrganizationZone({
      organizationId,
      zoneName: zoneName.trim(),
      zoneCode: zoneCode.trim().toUpperCase(),
      zoneDescription: zoneDescription?.trim() || "",
      zoneType: zoneType || "general",
      coordinates: validCoordinates,
      createdBy: authResult.userFullName || "system",
    });

    await newZone.save();

    return NextResponse.json(
      { message: "Zone created successfully", zoneData: newZone },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating zone:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
