import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationZone from "../../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

export async function GET(request, { params }) {
  // Authenticate & authorize user for reading zones
  const authResult = await authMiddleware("orgUserToken", "zone", "read")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;
  const { id } = await params;

  try {
    await connectDB();

    // Validate Zone ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Zone ID format." }, { status: 400 });
    }

    // Find zone by ID and organization
    const zone = await OrganizationZone.findOne({
      _id: id,
      organizationId,
    });

    if (!zone) {
      return NextResponse.json({ error: "Zone not found." }, { status: 404 });
    }

    // Return zone details
    return NextResponse.json({
        message: "Zone details fetched successfully",
        zoneData: zone
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching zone details:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
