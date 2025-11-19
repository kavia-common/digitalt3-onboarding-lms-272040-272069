import React from "react";
import Editor from "../components/Editor";

/**
 * In-browser code editor page for coding challenges.
 * Accessible, Ocean Professional-styled, with stubbed file list.
 */
// PUBLIC_INTERFACE
export default function EditorPage() {
  // Mock save/submit – will be replaced with real service
  const handleSave = async (file) => {
    // Simulate success or error
    if (!file.content.trim()) {
      throw new Error("Cannot save an empty file.");
    }
    // stub, succeed after short delay
    await new Promise(res => setTimeout(res, 110));
    // Optionally: save to localStorage/session for demo
  };
  const handleSubmit = async (file) => {
    if (file.content.indexOf("print") === -1) {
      throw new Error("For demo, code must include a print statement!");
    }
    await new Promise(res => setTimeout(res, 200));
  };

  return (
    <section aria-label="Code Editor Challenge Page">
      <h2 className="lms-title" tabIndex={0}>Code Editor</h2>
      <p className="lms-desc" tabIndex={0}>
        Practice your code challenge here! Edit files, then Save or Submit when ready.
      </p>
      <Editor
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
