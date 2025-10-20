export function generateUserTag(userName) {
  if (typeof userName !== 'string') {
    throw new Error('Invalid userName: must be a string');
  }

  const baseName = userName.trim().toLowerCase().replace(/\s+/g, '').slice(0, 6); // limit to first 6 chars

  const timestampPart = Date.now().toString(36).slice(-4); // last 4 chars of base36 timestamp
  const randomPart = Math.random().toString(36).slice(2, 4); // 2 random alphanumeric chars

  return `${baseName}${timestampPart}${randomPart}`; // e.g., john1a2b
}
