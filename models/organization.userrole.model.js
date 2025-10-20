import mongoose from "mongoose";

// Define allowed actions
const permissionsEnum = ["create", "read", "update", "delete"];

// Define allowed resources for Organization users
const resourcesEnum = [
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

// Subdocument schema for permissions
const orgUserRolePermissions = new mongoose.Schema(
  {
    resource: {
      type: String,
      enum: resourcesEnum,
      required: true,
    },
    permission: [
      {
        type: String,
        enum: permissionsEnum,
        required: true,
      },
    ],
  },
  {
    _id: false, // prevent _id field in each permission object
  }
);

// Main OrganizationUserRole schema
const organizationUserRoleSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: [orgUserRolePermissions],
      required: true,
      default: [
        {
          resource: "profileOwn",
          permission: ["read", "update"],
        },
        {
          resource: "passwordOwn",
          permission: ["read", "update"],
        },
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationUser",
      default: null, // set when created by a specific org user
    },
  },
  { timestamps: true }
);

// Model export
const OrganizationUserRole = mongoose.models.OrganizationUserRole || mongoose.model("OrganizationUserRole", organizationUserRoleSchema);
export default OrganizationUserRole;
