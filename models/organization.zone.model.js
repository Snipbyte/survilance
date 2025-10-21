import mongoose from "mongoose";

const organizationZoneSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    zoneName: {
      type: String,
      required: true,
      trim: true,
    },
    zoneCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    zoneDescription: {
      type: String,
      default: "",
      trim: true,
    },
    zoneType: {
      type: String, // Possible values: entry, exit, restricted, general
    //   enum: ["entry", "exit", "restricted", "general"],
      default: "general",
    },
    coordinates: {
      type: [
        {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
      ],
      required: false,
      default: [],
    },
    isZoneActive: {
      type: Boolean,
      default: true,
    },
    zoneStatus: {
      type: String, // e.g., active, inactive, maintenance
      default: "active",
    },
    installedDevices: {
    type: [
        {
        type: String,
        trim: true,
        uppercase: true,
        },
    ],
    default: [],
    }, // List of device IDs or MAC addresses installed in this zone e.g., ["AA:BB:CC:DD:EE:FF", "11:22:33:44:55:66"]
    createdBy: {
      type: String,
      required: true,
      default: "system",
    },
  },
  { timestamps: true }
);

const OrganizationZone = mongoose.models.OrganizationZone || mongoose.model("OrganizationZone", organizationZoneSchema);
export default OrganizationZone;
