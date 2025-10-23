import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { DeviceAlertHistory } from "../../../../models/DeviceAlertHistory";

// 🔹 Utility: consistent error response
const errorResponse = (message, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

// 🔹 Utility: safe number parser
const parseNumber = (value, fallback) => {
  const n = Number(value);
  return isNaN(n) || n <= 0 ? fallback : n;
};

// 🔹 Utility: MAC address validator
const isValidMacAddress = (mac) => {
  const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
};

// ======================================================
// 📍 GET: /api/deviceAlerts?page=1&limit=10&macAddress=AA:BB:CC:DD:EE:FF
// ======================================================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseNumber(searchParams.get("page"), 1);
    const limit = parseNumber(searchParams.get("limit"), 10);
    const macAddress = searchParams.get("macAddress");

    const query = {};
    if (macAddress) query.macAddress = macAddress.toUpperCase();

    // Count total for pagination
    const total = await DeviceAlertHistory.countDocuments(query);

    // Fetch paginated data
    const records = await DeviceAlertHistory.find(query)
      .select("-__v -updatedAt")
      .sort({ recordedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      message: "Device alerts fetched successfully",
      DeviceAlertHistoryDataNumber: total,
      DeviceAlertHistoryData: records,
      DeviceAlertHistoryDataPagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/device-alerts error:", err);
    return errorResponse("Internal server error", 500);
  }
}

// ======================================================
// 📍 POST: /api/deviceAlerts
// Body: { macAddress: "AA:BB:CC:DD:EE:FF", deviceAlert: "OVERHEAT", recordedAt?: "2025-10-15T13:56:47Z" }
// ======================================================
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate macAddress
    if (!body.macAddress || typeof body.macAddress !== "string" || body.macAddress.trim() === "") {
      return errorResponse("macAddress is required and must be a non-empty string");
    }
    if (!isValidMacAddress(body.macAddress.trim())) {
      return errorResponse("macAddress must be in valid format (e.g., AA:BB:CC:DD:EE:FF)");
    }

    // Validate deviceAlert
    if (!body.deviceAlert || typeof body.deviceAlert !== "string" || body.deviceAlert.trim() === "") {
      return errorResponse("deviceAlert is required and must be a non-empty string");
    }

    // Validate recordedAt
    let recordedAt = new Date();
    if (body.recordedAt) {
      if (isNaN(Date.parse(body.recordedAt))) {
        return errorResponse("Invalid recordedAt date format");
      }
      recordedAt = new Date(body.recordedAt);
    }

    // Save new record
    const newAlert = await DeviceAlertHistory.create({
      macAddress: body.macAddress.trim().toUpperCase(),
      deviceAlert: body.deviceAlert.trim(),
      recordedAt,
    });

    // Prepare clean response
    const { __v, updatedAt, ...cleanDoc } = newAlert.toObject();

    return NextResponse.json({
      message: "Device alert record created successfully",
      deviceAlertHistoryData: cleanDoc,
    });
  } catch (err) {
    console.error("POST /api/device-alerts error:", err);
    return errorResponse("Internal server error", 500);
  }
}
