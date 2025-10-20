import mongoose from "mongoose";

const alertHistorySchema = new mongoose.Schema(
  {
    modelType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    alertTypeCounts: {
      type: Map,
      of: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    macAddress: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const AlertHistory = mongoose.models.AlertHistory || mongoose.model("AlertHistory", alertHistorySchema);
