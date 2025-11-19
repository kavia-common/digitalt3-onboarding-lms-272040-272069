import React from "react";
import Editor from "../components/Editor";
import { saveFile, submitFile } from "../services/editorService";

/**
 * In-browser code editor page for coding challenges.
 * Accessible, Ocean Professional-styled, with stubbed file list.
 */
// PUBLIC_INTERFACE
export default function EditorPage() {
  // These handlers delegate to our dedicated service, ensuring error handling/edge cases
  const handleSave = async (file) => {
    await saveFile(file);
  };
  const handleSubmit = async (file) => {
    await submitFile(file);
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
