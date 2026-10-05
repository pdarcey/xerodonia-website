// Shared helpers for consulting data: used by the JSON-LD, services.json
// and llms.txt generators so prices are parsed one way everywhere.

/**
 * Turns a display price like "$20,000" into a number (20000).
 * Throws if the string has no number, so a malformed price in
 * consulting.yaml fails the build instead of publishing `NaN`.
 * @param {string} display
 * @returns {number}
 */
export function priceValue(display) {
  const digits = String(display).replace(/[^0-9.]/g, "");
  const value = Number.parseFloat(digits);
  if (!digits || Number.isNaN(value)) {
    throw new Error(`Can't read a price from "${display}" in consulting.yaml`);
  }
  return value;
}

/**
 * How an agent (or person) should send a consulting enquiry by email.
 * Published in services.json and llms.txt; the MCP server (Stage 5c)
 * will accept the same fields.
 */
export const enquiryFields = [
  { name: "name", required: true, description: "The enquirer's full name" },
  { name: "email", required: true, description: "Where we should reply" },
  { name: "company", required: false, description: "Business name" },
  { name: "message", required: true, description: "What they'd like help with: team size, current tools, goals" },
  { name: "preferredTimes", required: false, description: "Times that suit for a call, with time zone" },
  { name: "submittedBy", required: false, description: "If an AI agent is sending this on someone's behalf, which agent" },
];
