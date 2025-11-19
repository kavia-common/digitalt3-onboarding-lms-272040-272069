import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";

/**
 * Quiz component
 * Supports: Multiple Choice (single answer), True/False (radio), accessible forms & error display
 * Props:
 *   - quiz: { title, questions: [ { ... } ] }
 *   - submitting: bool
 *   - onSubmit(answers) -> Promise
 *   - result: { passed, score, error }
 */
const Quiz = forwardRef(function Quiz({ quiz, submitting, onSubmit, result }, ref) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  // For keyboard focus management
  const firstInputRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: () => {
      setAnswers({});
      setErrors({});
      setFormTouched(false);
    }
  }));

  function handleChange(qId, selected) {
    setAnswers(prev => ({ ...prev, [qId]: selected }));
    setErrors(prev => ({ ...prev, [qId]: undefined }));
  }

  function validate() {
    // Require every question to be answered
    const errObj = {};
    quiz.questions.forEach(q => {
      if (answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === "") {
        errObj[q.id] = "Required";
      }
    });
    setErrors(errObj);
    return Object.keys(errObj).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormTouched(true);
    if (!validate()) {
      // Focus first error
      const firstErr = quiz.questions.find(q => errors[q.id]);
      if (firstErr && firstInputRef.current) {
        firstInputRef.current.focus();
      }
      return;
    }
    if (onSubmit) {
      await onSubmit(answers);
    }
  }

  // Rendering logic
  return (
    <section
      aria-label="Quiz"
      style={{
        border: "1.5px solid #2563EB33",
        borderRadius: 11,
        background: "#f8fafc",
        padding: "1.3em 1.2em",
        marginTop: 16,
        maxWidth: 720,
        boxShadow: "0 2px 9px #2563EB07"
      }}
    >
      <form onSubmit={handleSubmit} aria-describedby="quiz-instructions" style={{ display: "flex", flexDirection: "column", gap: "1.3em" }}>
        <div id="quiz-instructions" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "1.09em", marginBottom: 7 }}>
          <span aria-hidden="true">📝</span> {quiz.title || "Quiz"}
        </div>
        {quiz.questions.map((q, idx) => {
          const isMC = q.type === "mc" || q.type === "multiple_choice";
          const isTF = q.type === "tf" || q.type === "true_false";
          const errorMsg = (formTouched || submitting) && errors[q.id];
          return (
            <div
              key={q.id}
              style={{
                background: "#fff",
                borderRadius: 9,
                boxShadow: errorMsg ? "0 0 0 2.1px #EF4444" : "0 0 1.5px #2563EB06",
                padding: "1em 1.1em",
                marginBottom: 2
              }}
              aria-invalid={!!errorMsg}
              aria-describedby={errorMsg ? `quiz-q${q.id}-error` : undefined}
            >
              <label
                htmlFor={`q-${q.id}-0`}
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: ".7em",
                  fontSize: "1.09em"
                }}
              >
                {idx + 1}. {q.prompt}
                {q.required && <span aria-label="required" style={{ color: "#EF4444", marginLeft: 4 }}>*</span>}
              </label>
              <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <legend style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>Answer</legend>
                {isMC &&
                  q.choices.map((choice, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      <input
                        ref={idx === 0 && i === 0 ? firstInputRef : null}
                        type="radio"
                        id={`q-${q.id}-${i}`}
                        name={`q-${q.id}`}
                        value={choice}
                        checked={answers[q.id] === choice}
                        onChange={e => handleChange(q.id, choice)}
                        required={q.required}
                        tabIndex={0}
                        aria-required={q.required}
                        aria-invalid={!!errorMsg}
                        style={{
                          accentColor: "var(--primary)",
                          marginRight: 10,
                          width: "1em",
                          height: "1em",
                          verticalAlign: "-0.1em"
                        }}
                        onKeyDown={e => {
                          // Allow space/enter to select radio if not checked
                          if ((e.key === " " || e.key === "Enter") && !answers[q.id]) {
                            e.preventDefault();
                            handleChange(q.id, choice);
                          }
                        }}
                      />
                      <label htmlFor={`q-${q.id}-${i}`} style={{ fontSize: "1.02em" }}>{choice}</label>
                    </div>
                  ))}
                {isTF && (
                  <div style={{ display: "flex", gap: "2.1em" }}>
                    {["True", "False"].map((choice, i) => (
                      <span key={choice}>
                        <input
                          ref={idx === 0 && i === 0 ? firstInputRef : null}
                          type="radio"
                          id={`q-${q.id}-${i}`}
                          name={`q-${q.id}`}
                          value={choice}
                          checked={answers[q.id] === choice}
                          onChange={e => handleChange(q.id, choice)}
                          required={q.required}
                          tabIndex={0}
                          aria-required={q.required}
                          aria-invalid={!!errorMsg}
                          style={{
                            accentColor: "var(--primary)",
                            marginRight: 7,
                            width: "1em",
                            height: "1em"
                          }}
                        />
                        <label htmlFor={`q-${q.id}-${i}`} style={{ fontSize: "1.02em" }}>{choice}</label>
                      </span>
                    ))}
                  </div>
                )}
              </fieldset>
              {errorMsg && (
                <div
                  id={`quiz-q${q.id}-error`}
                  style={{
                    color: "#EF4444",
                    fontSize: ".97em",
                    marginTop: 2,
                  }}
                  role="alert"
                  aria-live="assertive"
                  tabIndex={0}
                >
                  {errorMsg}
                </div>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="lms-btn lms-btn-primary"
          disabled={submitting}
          aria-label="Submit Quiz"
          style={{ width: 200, alignSelf: "flex-end" }}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>

        {result && result.score !== undefined && (
          <div
            style={{
              color: result.passed ? "#22c55e" : "#EF4444",
              background: result.passed ? "#E7FAEF" : "#fee2e2",
              margin: "0.5em 0 0 0",
              padding: "0.5em 1em",
              borderRadius: 7,
              fontWeight: 600
            }}
            role="status"
            aria-live="polite"
            tabIndex={0}
          >
            Quiz Result: {result.passed ? "Passed" : "Not passed"} (Score: {result.score}%)
          </div>
        )}

      </form>
    </section>
  );
});

export default Quiz;
