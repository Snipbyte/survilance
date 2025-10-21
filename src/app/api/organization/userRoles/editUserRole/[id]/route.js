import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../../lib/mongodb";
import { authMiddleware } from "../../../../../../../middleware/authMiddleware";
import OrganizationUserRole from "../../../../../../../models/organization.userrole.model";

const VALID_RESOURCES = [
  "organization",
  "user",
  "role",
  "device",
  "location",
  "profileOwn",
  "profileAny",
  "passwordOwn",
  "passwordAny",
  "notification",
  "report",
  "alert",
  "logs",
  "zone",
  "camera",
  "analytics",
  "dashboard",
  "settings",
];

const VALID_PERMISSIONS = ["create", "read", "update", "delete"];

export async function PUT(request, { params }) {
  const { id } = params;

  const authResult = await authMiddleware("orgUserToken", "user", "update")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId } = authResult;

  try {
    await connectDB();

    const updates = await request.json();
    const { name, description, permissions } = updates;

    const existingRole = await OrganizationUserRole.findOne({ _id: id, organizationId });
    if (!existingRole) {
      return NextResponse.json({ error: "User role not found or access denied." }, { status: 404 });
    }

    // If name is changing, check for duplication
    if (name && name !== existingRole.name) {
      const duplicate = await OrganizationUserRole.findOne({
        organizationId,
        name,
        _id: { $ne: id },
      });

      if (duplicate) {
        return NextResponse.json({ error: "A role with this name already exists." }, { status: 409 });
      }
    }

    // Validate permissions if provided
    if (permissions !== undefined) {
      if (!Array.isArray(permissions) || permissions.length === 0) {
        return NextResponse.json({ error: "Permissions must be a non-empty array." }, { status: 400 });
      }

      for (const permObj of permissions) {
        const { resource, permission } = permObj;

        if (!resource || !VALID_RESOURCES.includes(resource)) {
          return NextResponse.json({ error: `Invalid or missing resource: "${resource}"` }, { status: 400 });
        }

        if (
          !Array.isArray(permission) ||
          permission.length === 0 ||
          permission.some((p) => !VALID_PERMISSIONS.includes(p))
        ) {
          return NextResponse.json({ error: `Invalid permissions array for resource: "${resource}"` }, { status: 400 });
        }
      }

      existingRole.permissions = permissions;
    }

    if (name !== undefined) existingRole.name = name.trim();
    if (description !== undefined) existingRole.description = description.trim();

    await existingRole.save();

    return NextResponse.json(
      { message: "User role updated successfully", roleData: existingRole },
      { status: 200 }
    );
  } catch (error) {
    console.error("Edit user role error:", error);
    return NextResponse.json({ error: "Failed to update user role." }, { status: 500 });
  }
}
