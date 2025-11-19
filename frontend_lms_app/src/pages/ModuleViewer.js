import React, { useEffect, useState, useRef } from "react";
import { getModuleById, updateModuleProgress, submitQuizAnswers } from "../services/mockLmsData";
import Quiz from "../components/Quiz";

/**
 * ModuleViewer: Displays a learning module and quiz for an employee
 * - Accessible, responsive, Ocean Professional styled
 * - Receives :moduleId param via router
 */
// PUBLIC_INTERFACE
export default function ModuleViewer({ moduleId }) {
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const quizRef = useRef();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Simulate fetching a module by id (could use params)
    getModuleById(moduleId).then((mod) => {
      if (mounted) {
        setModule(mod);
        setLoading(false);
      }
    });
    return () => { mounted = false; }
  }, [moduleId]);

  // When quiz is submitted:
  async function handleSubmitQuiz(answers) {
    setQuizSubmitting(true);
    setQuizResult(null);
    try {
      const result = await submitQuizAnswers(module.id, answers);
      setQuizResult(result);
      // Mark module progress as complete if passed
      if (result.passed) {
        await updateModuleProgress(module.id, { status: "completed", score: result.score });
      }
    } catch (err) {
      setQuizResult({ error: "Error submitting quiz. Try again." });
    }
    setQuizSubmitting(false);
  }

  if (loading) {
    return (<div className="lms-card" style={{ minHeight: 210, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "var(--primary)" }} role="status" aria-live="polite">
        Loading module...
      </span>
    </div>);
  }
  if (!module) return <div className="lms-card">Could not find the module.</div>;

  return (
    <div>
      <section className="lms-card" style={{ marginBottom: 20 }}>
        <h2 className="lms-title" tabIndex={0}>{module.title}</h2>
        <div className="lms-desc" tabIndex={0} style={{ marginBottom: 22 }}>{module.description}</div>
        <article
          aria-label="Module Content"
          style={{
            fontSize: "1.07rem",
            lineHeight: 1.65,
            color: "var(--text)",
            background: "var(--surface)",
            borderRadius: 9,
            padding: "1.1em 0.8em",
            boxShadow: "0 1px 8px #2563EB0C",
            marginBottom: 13,
            overflowX: "auto",
            maxWidth: 720
          }}
          tabIndex={0}
        >
          <div dangerouslySetInnerHTML={{ __html: module.content }} />
        </article>
        {module.quiz && (
          <Quiz
            ref={quizRef}
            quiz={module.quiz}
            onSubmit={handleSubmitQuiz}
            submitting={quizSubmitting}
            result={quizResult}
          />
        )}
        {quizResult && quizResult.passed && (
          <div
            style={{
              marginTop: "1.5em",
              color: "#22c55e",
              background: "#e7faef",
              borderRadius: 9,
              padding: "1em 1.3em"
            }}
            role="status"
            aria-live="polite"
            tabIndex={0}
          >
            <b>Congratulations!</b> You've passed this module.
          </div>
        )}
        {quizResult && quizResult.error && (
          <div
            style={{
              color: "var(--error)",
              background: "#fee2e2",
              borderRadius: 9,
              padding: "1em 1.3em",
              marginTop: 10
            }}
            role="alert"
            aria-live="polite"
            tabIndex={0}
          >
            {quizResult.error}
          </div>
        )}
      </section>
    </div>
  );
}
