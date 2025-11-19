//
/*
 * Editor Service for Monaco Editor integration.
 * Saves, submits, and validates editor files.
 * In production, routes requests through src/api/client.js; for local/demo, falls back to mocks.
 */

/**
 * Simulates saving a file. Fails for empty content.
 * @param {{ id: string, label: string, content: string, language: string }} file 
 * @returns {Promise<void>}
 */
import { apiRequest } from "../api/client";

// PUBLIC_INTERFACE
export async function saveFile(file) {
  /** This is a public function: saves an editor file, errors if blank. */
  if (!file.content?.trim()) {
    throw new Error("Cannot save an empty file.");
  }
  // Prefer API mock
  try {
    await apiRequest("/editor/save", "POST", { body: file });
    return;
  } catch (err) {
    // Fallback: fake delay for demo
    await new Promise((res) => setTimeout(res, 110));
  }
}

/**
 * Simulates submitting a file. Fails unless code includes a 'print' statement.
 * @param {{ id: string, label: string, content: string, language: string }} file 
 * @returns {Promise<void>}
 */
/**
 * Submits file for evaluation.
 */
export async function submitFile(file) {
  /** This is a public function: submits an editor file, errors if program doesn't include a print. */
  if (!file.content || file.content.indexOf("print") === -1) {
    throw new Error("For demo, code must include a print statement!");
  }
  // Try using API
  try {
    await apiRequest("/editor/submit", "POST", { body: file });
    return;
  } catch (_err) {
    await new Promise((res) => setTimeout(res, 190));
  }
}

export default { saveFile, submitFile };
