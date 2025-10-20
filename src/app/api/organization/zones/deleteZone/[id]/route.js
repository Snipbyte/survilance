import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../../lib/mongodb";
import OrganizationZone from "../../../../../../../models/organization.zone.model";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";

export async function DELETE(request, { params }) {
  const authResult = await authMiddleware("orgUserToken", "zone", "delete")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;
  const { id } = params;

  try {
    await connectDB();

    // Validate Zone ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Zone ID format." }, { status: 400 });
    }

    const deletedZone = await OrganizationZone.findOneAndDelete({
      _id: id,
      organizationId,
    });

    if (!deletedZone) {
      return NextResponse.json({ error: "Zone not found or not authorized." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Zone deleted successfully", zoneData: deletedZone },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting zone:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
