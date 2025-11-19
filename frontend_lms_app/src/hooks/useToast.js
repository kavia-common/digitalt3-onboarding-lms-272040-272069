import { useRef, useCallback, useReducer } from "react";

function toastReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.toast];
    case "remove":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

/**
 * useToast hook: returns [toasts, addToast, removeToast]
 * addToast({ type, message }) where type = "success" | "error"
 */
export function useToast() {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const idRef = useRef(0);

  const addToast = useCallback(
    ({ message, type = "success" }) => {
      const id = ++idRef.current;
      dispatch({ type: "add", toast: { id, message, type } });
    },
    []
  );
  const removeToast = useCallback(
    (id) => {
      dispatch({ type: "remove", id });
    },
    []
  );

  return [toasts, addToast, removeToast];
}
