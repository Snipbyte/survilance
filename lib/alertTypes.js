// lib/alertTypes.js

export const ALERT_TYPE_MAP = {
  "1": "ear",
  "2": "ear-mufs",
  "3": "face",
  "4": "face-guard",
  "5": "face-mask",
  "6": "foot",
  "7": "tool",
  "8": "glasses",
  "9": "gloves",
  "10": "helmet",
  "11": "hands",
  "12": "head",
  "13": "medical-suit",
  "14": "shoes",
  "15": "safety-suit",
  "16": "safety-vest",
  "17": "safety-harness"
};

// Reverse mapping for convenience names to IDs
export const ALERT_TYPE_REVERSE_MAP = Object.fromEntries(
  Object.entries(ALERT_TYPE_MAP).map(([key, value]) => [value, key])
);

// Usage example:
// import { ALERT_TYPE_MAP } from './lib/alertTypes';
// const alertName = ALERT_TYPE_MAP[alertId];

// e.g., ALERT_TYPE_MAP["1"] will return "person"

// import { ALERT_TYPE_REVERSE_MAP } from "@/lib/alertTypes";
// const alertId = ALERT_TYPE_REVERSE_MAP[alertName];

// e.g., ALERT_TYPE_REVERSE_MAP["person"] will return "1"
// e.g., ALERT_TYPE_REVERSE_MAP["safety-harness"] will return "18"
