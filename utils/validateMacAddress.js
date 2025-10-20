/**
 * Validate MAC address format
 * @param {string} mac - The MAC address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidMacAddress(mac) {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac.trim().toUpperCase());
}

// Valid Mac Address Examples:
// 00:1A:2B:3C:4D:5E
// 00-1A-2B-3C-4D-5E
// aa:bb:cc:dd:ee:ff
// AA-BB-CC-DD-EE-FF