import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { AlertHistory } from "../../../../models/AlertHistory";

// Utility: Consistent error response
const errorResponse = (message, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

// Utility: Safe number parser with defaults
const parseNumber = (value, fallback) => {
  const n = Number(value);
  return isNaN(n) || n <= 0 ? fallback : n;
};

// Utility: MAC address validator
const isValidMacAddress = (mac) => {
  const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
};

// GET: /api/alerts?modelType=PPE&page=1&limit=10
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const modelType = searchParams.get("modelType");
    const macAddress = searchParams.get("macAddress");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseNumber(searchParams.get("page"), 1);
    const limit = parseNumber(searchParams.get("limit"), 10);

    if (!modelType) return errorResponse("modelType is required");

    // Build dynamic query
    const query = { modelType };

    // Filter by MAC address (optional)
    if (macAddress) {
      const formattedMac = macAddress.trim().toUpperCase();
      if (!isValidMacAddress(formattedMac)) {
        return errorResponse("Invalid macAddress format (expected AA:BB:CC:DD:EE:FF)");
      }
      query.macAddress = formattedMac;
    }

    // Filter by date range (optional)
    if (dateFrom || dateTo) {
      query.recordedAt = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (isNaN(from.getTime())) return errorResponse("Invalid dateFrom format");
        query.recordedAt.$gte = from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (isNaN(to.getTime())) return errorResponse("Invalid dateTo format");
        // Extend end date to include full day (23:59:59)
        to.setHours(23, 59, 59, 999);
        query.recordedAt.$lte = to;
      }
    }

    // Count total records
    const total = await AlertHistory.countDocuments(query);

    // Fetch paginated records
    const records = await AlertHistory.find(query)
      .select("-__v -createdAt -updatedAt")
      .sort({ recordedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      message: "Alert history fetched successfully",
      AlarmHistoryDataNumber: total,
      AlarmHistoryData: records,
      AlarmHistoryDataPagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/alerts error:", err);
    return errorResponse("Internal server error", 500);
  }
}

// POST: /api/alerts?modelType=PPE
export async function POST(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const modelType = searchParams.get("modelType");

    if (!modelType) {
      return errorResponse("modelType is required");
    }

    const body = await req.json();

    // macAddress validation with format
    if (!body.macAddress || typeof body.macAddress !== "string" || body.macAddress.trim() === "") {
      return errorResponse("macAddress is required and must be a non-empty string");
    }
    if (!isValidMacAddress(body.macAddress.trim())) {
      return errorResponse("macAddress must be in valid format (e.g., AA:BB:CC:DD:EE:FF)");
    }

    // Validate alertTypeCounts
    if (
      !body.alertTypeCounts ||
      typeof body.alertTypeCounts !== "object" ||
      Array.isArray(body.alertTypeCounts)
    ) {
      return errorResponse("alertTypeCounts must be a valid object");
    }

    // Updated validation for nested structure
    for (const [outerKey, innerMap] of Object.entries(body.alertTypeCounts)) {
      if (typeof innerMap !== "object" || Array.isArray(innerMap)) {
        return errorResponse(`alertTypeCounts['${outerKey}'] must be an object`);
      }
      for (const [innerKey, value] of Object.entries(innerMap)) {
        if (typeof value !== "boolean") {
          return errorResponse(
            `Invalid value for alertTypeCounts['${outerKey}']['${innerKey}']: must be a boolean`
          );
        }
      }
    }

    // Validate recordedAt
    let recordedAt = new Date();
    if (body.recordedAt) {
      const parsed = new Date(body.recordedAt);
      if (isNaN(parsed.getTime())) {
        return errorResponse("Invalid recordedAt date format");
      }
      recordedAt = parsed;
    }

    const newRecord = await AlertHistory.create({
      modelType,
      alertTypeCounts: body.alertTypeCounts,
      recordedAt,
      macAddress: body.macAddress.trim().toUpperCase(),
    });

    // Exclude __v, createdAt, updatedAt from response
    newRecord._doc.__v = undefined;
    newRecord._doc.createdAt = undefined;
    newRecord._doc.updatedAt = undefined;

    return NextResponse.json({
      message: "Alert history record created successfully",
      AlarmHistoryData: newRecord,
    });
  } catch (err) {
    console.error("POST /api/alerts error:", err);
    return errorResponse("Internal server error", 500);
  }
}
