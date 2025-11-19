import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

/**
 * File editor panel with Monaco, Ocean Professional theme,
 * file pane (stub), Save/Submit, accessibility, and error handling.
 */
const demoFiles = [
  { id: "main.py", label: "main.py", language: "python", content: "# Start coding here\nprint('Hello DigitalT3!')\n" },
  { id: "utils.py", label: "utils.py", language: "python", content: "# Helper functions go here\n" }
];

// PUBLIC_INTERFACE
export default function Editor({ initialFiles, onSave, onSubmit }) {
  // File state setup
  const files = initialFiles && initialFiles.length ? initialFiles : demoFiles;
  const [activeFile, setActiveFile] = useState(files[0]);
  const [code, setCode] = useState(activeFile.content || "");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // PUBLIC_INTERFACE
  function handleFileSelect(file) {
    setActiveFile(file);
    setCode(file.content || "");
    setError(null);
    setSuccess(null);
  }

  // PUBLIC_INTERFACE
  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true); setError(null); setSuccess(null);
    try {
      // For demo, use a mocked service (simulate async save)
      if (onSave) {
        await onSave({ ...activeFile, content: code });
      } else {
        await new Promise(res => setTimeout(res, 300));
      }
      setSuccess("File saved.");
      setActiveFile({ ...activeFile, content: code }); // update file in local state
    } catch (err) {
      setError(err?.message || "Failed to save file.");
    }
    setSaving(false);
  }

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      // For demo, use a mocked service (simulate async submit)
      if (onSubmit) {
        await onSubmit({ ...activeFile, content: code });
      } else {
        await new Promise(res => setTimeout(res, 600));
      }
      setSuccess("Code submitted!");
    } catch (err) {
      setError(err?.message || "Failed to submit code.");
    }
    setSubmitting(false);
  }

  // ARIA & keyboard: file navigation, esc to focus editor, etc.
  function handleKeyDownFilelist(e, file, idx) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFileSelect(file);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = document.querySelector(`[data-file-idx='${idx + 1}']`);
      if (next) next.focus();
    }
    if (e.key === "ArrowUp" && idx > 0) {
      e.preventDefault();
      const prev = document.querySelector(`[data-file-idx='${idx - 1}']`);
      if (prev) prev.focus();
    }
  }

  return (
    <div
      className="lms-card"
      style={{
        display: "flex",
        flexDirection: "row",
        background: "var(--card-bg)",
        borderRadius: "var(--card-radius,14px)",
        minHeight: 480,
        boxShadow: "var(--card-shadow)"
      }}
    >
      {/* File pane stub */}
      <nav
        aria-label="Files"
        style={{
          minWidth: 142,
          maxWidth: 220,
          background: "#eef2fb",
          borderRight: "1.5px solid #e3e8f2",
          borderRadius: "11px 0 0 11px",
          padding: "12px 6px 9px 10px",
          display: "flex", flexDirection: "column", gap: 1
        }}
        role="navigation"
      >
        <h4
          style={{
            margin: "0 0 11px 4px",
            color: "var(--primary)",
            fontWeight: 600,
            fontSize: "1.03em",
            letterSpacing: "0.01em"
          }}
          tabIndex={0}
        >
          Files
        </h4>
        <ul
          style={{ listStyle: "none", padding: 0, margin: 0, width: "100%" }}
          aria-label="File list"
        >
          {files.map((file, idx) => (
            <li key={file.id}>
              <button
                className="lms-filetab"
                style={{
                  fontFamily: "monospace, 'Menlo', 'Monaco'",
                  fontSize: ".98em",
                  background: activeFile.id === file.id ? "var(--secondary)" : "transparent",
                  color: activeFile.id === file.id ? "#111" : "#2563EB",
                  border: "none",
                  padding: "5.5px 13px",
                  margin: "2px 0",
                  borderRadius: 7,
                  width: "100%",
                  textAlign: "left",
                  fontWeight: activeFile.id === file.id ? 700 : 500,
                  outline: "none",
                  cursor: activeFile.id === file.id ? "default" : "pointer",
                  opacity: activeFile.id === file.id ? 1 : 0.88,
                  transition: "background 0.16s"
                }}
                aria-current={activeFile.id === file.id ? "page" : undefined}
                aria-label={`Edit ${file.label}`}
                tabIndex={0}
                data-file-idx={idx}
                onClick={() => handleFileSelect(file)}
                onKeyDown={e => handleKeyDownFilelist(e, file, idx)}
              >
                <span aria-hidden="true" role="img" style={{ marginRight: 8 }}>📄</span>
                {file.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Editor area */}
      <div
        style={{
          flex: 1,
          padding: "0 0 0 0",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          borderRadius: "0 11px 11px 0",
          background: "var(--surface)"
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            padding: "10px 19px 4px 19px",
            borderBottom: "1.2px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span
            style={{
              color: "var(--primary)",
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: "1.07em"
            }}
            tabIndex={0}
          >
            {activeFile.label}
          </span>
          <span
            style={{
              color: "#6c7ba1",
              opacity: 0.65,
              fontSize: ".97em"
            }}
            aria-label="Current Language"
          >
            {activeFile.language || "text"}
          </span>
        </div>
        {/* Monaco */}
        <div style={{ flex: 1, minHeight: 340, borderRadius: 0, overflow: "hidden" }}>
          <MonacoEditor
            height="340px"
            defaultLanguage={activeFile.language || "python"}
            language={activeFile.language || "python"}
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              fontFamily: "monospace, Menlo, Monaco",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              automaticLayout: true,
              theme: "light",
              ariaLabel: "Code Editor",
              wordWrap: "on"
            }}
            onChange={value => {
              setCode(value);
              setSuccess(null);
              setError(null);
            }}
            aria-label="In-browser code editor"
          />
        </div>
        {/* Controls */}
        <form
          style={{
            display: "flex", flexDirection: "row", gap: 14,
            justifyContent: "flex-end", padding: "10px 18px"
          }}
          onSubmit={handleSubmit}
          aria-label="Editor actions"
        >
          <button
            type="button"
            className="lms-btn"
            style={{ maxWidth: 120, padding: "9px 15px", background: "var(--secondary)" }}
            onClick={handleSave}
            aria-label="Save file"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="submit"
            className="lms-btn lms-btn-primary"
            style={{ maxWidth: 150, padding: "9px 19px", marginLeft: 0 }}
            aria-label="Submit code"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        {/* Feedback/Error display */}
        {success && (
          <div
            style={{
              color: "#15803d",
              background: "#E7FAEF",
              borderRadius: 7,
              fontWeight: 600,
              fontSize: "1.02em",
              margin: "0 19px 10px 19px",
              padding: "8.5px 16px"
            }}
            role="status"
            aria-live="polite"
            tabIndex={0}
          >
            {success}
          </div>
        )}
        {error && (
          <div
            style={{
              color: "var(--error)",
              background: "#fee2e2",
              borderRadius: 7,
              fontWeight: 600,
              margin: "0 19px 10px 19px",
              padding: "8.5px 16px"
            }}
            role="alert"
            aria-live="assertive"
            tabIndex={0}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
