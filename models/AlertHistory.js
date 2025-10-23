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
      of: {
        type: Map,
        of: Boolean,
      },
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

export const AlertHistory =
  mongoose.models.AlertHistory ||
  mongoose.model("AlertHistory", alertHistorySchema);


//   {
//   "modelType": "DeviceX",
//   "macAddress": "AB:CD:EF:12:34:56",
//   "alertTypeCounts": {
//     "1": { "1": true, "3": true, "8": true, "12": true, "11": true },
//     "2": { "3": true, "11": true, "12": true, "1": true }
//   },
//   "recordedAt": "2024-06-15T10:20:30Z"
// }
