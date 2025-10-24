import mongoose from "mongoose";

const organizationCameraDeviceSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },    
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: false, // Device may not be assigned to a zone initially
      index: true,
    },
    deviceName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    deviceType: {
      type: String, // e.g., IP Camera, CCTV, Webcam
      required: true,
      trim: true,
      default: "surveillance",
    },
    deviceIP: { 
      type: String,
      required: true,
      trim: true,
     
    },
    deviceMAC: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    deviceResolution: {
      type: String, // e.g., 1080p, 4K
      default: "1920x1080",
    },
    deviceLocation: {
      type: String,
      default: "",
    },
    isDeviceActive: {
      type: Boolean,
      default: true,
    },
    deviceStatus: {
      type: String, // e.g., online, offline, maintenance
      default: "offline",
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    createdBy: {
      type: String,
      required: true,
      default: "system",
    },
  },
  { timestamps: true }
);

const OrganizationCameraDevice = mongoose.models.OrganizationCameraDevice || mongoose.model("OrganizationCameraDevice", organizationCameraDeviceSchema);
export default OrganizationCameraDevice;