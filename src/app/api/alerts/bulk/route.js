import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import { AlertHistory } from "../../../../../models/AlertHistory";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

// Utility: Error response
const errorResponse = (message, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

// Utility: Random integer between min & max
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Utility: Generate all dates between start and end (inclusive)
const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Utility: Generate a random time within a day
const randomTimeForDate = (date) => {
  const newDate = new Date(date);
  const hours = randomInt(0, 23);
  const minutes = randomInt(0, 59);
  const seconds = randomInt(0, 59);
  newDate.setHours(hours, minutes, seconds, 0);
  return newDate;
};

// Utility: MAC address validator
const isValidMacAddress = (mac) => {
  const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
};

// Simple random MAC generator (optional fallback)
const randomMacAddress = () => {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join(":");
};

// POST: /api/alerts/bulk?modelType=PPE
export async function POST(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const modelType = searchParams.get("modelType");

    if (!modelType) {
      return errorResponse("modelType is required");
    }

    const body = await req.json();
    const { startDate, endDate, recordsPerDay = 5, macAddress } = body;

    if (!startDate || !endDate) {
      return errorResponse("startDate and endDate are required");
    }
    if (typeof recordsPerDay !== "number" || recordsPerDay <= 0) {
      return errorResponse("recordsPerDay must be a positive number");
    }

    // Validate macAddress if provided
    if (macAddress) {
      if (typeof macAddress !== "string" || macAddress.trim() === "") {
        return errorResponse("macAddress must be a non-empty string if provided");
      }
      if (!isValidMacAddress(macAddress.trim())) {
        return errorResponse("macAddress must be in valid format (e.g., AA:BB:CC:DD:EE:FF)");
      }
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return errorResponse("Invalid date format for startDate or endDate");
    }
    if (start > end) {
      return errorResponse("startDate cannot be after endDate");
    }

    const allDates = getDateRange(start, end);
    const alertKeys = Object.keys(ALERT_TYPE_MAP);
    const bulkDocs = [];

    for (const date of allDates) {
      for (let i = 0; i < recordsPerDay; i++) {
        // Randomly pick 3–12 alert types for this record
        const countToPick = randomInt(3, 12);
        const selectedKeys = alertKeys.sort(() => 0.5 - Math.random()).slice(0, countToPick);

        const alertTypeCounts = {};
        selectedKeys.forEach((key) => {
          alertTypeCounts[key] = randomInt(1, 20);
        });

        bulkDocs.push({
          modelType,
          alertTypeCounts,
          recordedAt: randomTimeForDate(date),
          macAddress: macAddress?.trim().toUpperCase() || randomMacAddress().toUpperCase(),
        });
      }
    }

    // Insert all generated records
    await AlertHistory.insertMany(bulkDocs);

    return NextResponse.json({
      success: true,
      message: `Inserted ${bulkDocs.length} random alert records (${recordsPerDay} per day) from ${startDate} to ${endDate}`,
    });
  } catch (err) {
    console.error("POST /api/alerts/bulk error:", err);
    return errorResponse("Internal server error", 500);
  }
}
