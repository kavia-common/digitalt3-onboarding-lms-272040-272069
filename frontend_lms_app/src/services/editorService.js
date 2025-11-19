//
// Mock Editor Service for Monaco Editor integration.
// Provides dedicated save and submit file interfaces with robust error and ARIA feedback support.
//

/**
 * Simulates saving a file. Fails for empty content.
 * @param {{ id: string, label: string, content: string, language: string }} file 
 * @returns {Promise<void>}
 */
// PUBLIC_INTERFACE
export async function saveFile(file) {
  /** This is a public function: saves an editor file, errors if blank. */
  if (!file.content?.trim()) {
    // Simulate robust error with ARIA in mind
    throw new Error("Cannot save an empty file.");
  }
  // Simulate async save delay
  await new Promise(res => setTimeout(res, 110));
  // Optionally, persist to localStorage/sessionStorage here for demos
}

/**
 * Simulates submitting a file. Fails unless code includes a 'print' statement.
 * @param {{ id: string, label: string, content: string, language: string }} file 
 * @returns {Promise<void>}
 */
// PUBLIC_INTERFACE
export async function submitFile(file) {
  /** This is a public function: submits an editor file, errors if program doesn't include a print. */
  if (!file.content || file.content.indexOf("print") === -1) {
    throw new Error("For demo, code must include a print statement!");
  }
  await new Promise(res => setTimeout(res, 190));
}

export default { saveFile, submitFile };
