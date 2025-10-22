import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/mongodb";
import { authMiddleware } from "../../../../../../middleware/authMiddleware";
import OrganizationUserRole from "../../../../../../models/organization.userrole.model";

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

export async function POST(request) {
  const authResult = await authMiddleware("orgUserToken", "user", "create")(request);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: authResult.status });
  }

  const { organizationId, userFullName  } = authResult;


  try {
    await connectDB();
    const { name, description, permissions } = await request.json();

    // Check required fields
    if (!name || !description || !Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        { error: "Role name, description, and at least one permission set are required." },
        { status: 400 }
      );
    }

    // Normalize role name
    const normalizedRoleName = name.trim();

    // Check for existing role with same name in the organization
    const existing = await OrganizationUserRole.findOne({ organizationId, name: normalizedRoleName });
    if (existing) {
      return NextResponse.json(
        { error: "A role with this name already exists for your organization." },
        { status: 409 }
      );
    }

    // Validate permissions structure
    for (const permObj of permissions) {
      const { resource, permission } = permObj;

      if (!resource || !VALID_RESOURCES.includes(resource)) {
        return NextResponse.json(
          { error: `Invalid or missing resource: "${resource}"` },
          { status: 400 }
        );
      }

      if (
        !Array.isArray(permission) ||
        permission.length === 0 ||
        permission.some((p) => !VALID_PERMISSIONS.includes(p))
      ) {
        return NextResponse.json(
          { error: `Invalid or missing permissions for resource: "${resource}"` },
          { status: 400 }
        );
      }
    }

    // Create and save the new user role
    const newRole = new OrganizationUserRole({
      organizationId,
      name: normalizedRoleName,
      description: description.trim(),
      permissions,
      createdBy: authResult._id || "System",
    });

    await newRole.save();

    return NextResponse.json(
      { message: "User role created successfully", roleData: newRole },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create UserRole error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the role." },
      { status: 500 }
    );
  }
}
