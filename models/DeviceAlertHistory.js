import mongoose from "mongoose";

const DeviceAlertHistorySchema = new mongoose.Schema(
  {
    macAddress: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    deviceAlert: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    }, { timestamps: true }
);
export const DeviceAlertHistory = mongoose.models.DeviceAlertHistory || mongoose.model("DeviceAlertHistory", DeviceAlertHistorySchema);
