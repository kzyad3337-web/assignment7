
import { useEffect, useReducer } from "react";

const initialState = {
  loading: true,
  error: null,
  data: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: null,
        data: null,
      };

    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: null,
        data: action.payload,
      };

    case "FETCH_ERROR":
      return {
        loading: false,
        error: action.payload,
        data: null,
      };

    default:
      return state;
  }
}

export default function useFetch(fetchFunction, inputs = []) {
  const [state, dispatch] = useReducer(
    fetchReducer,
    initialState
  );

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadData() {
      dispatch({ type: "FETCH_START" });

      try {
        const result = await fetchFunction(
          controller.signal,
          ...inputs
        );

        if (!cancelled) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: result,
          });
        }
      } catch (error) {
        if (!cancelled && error.name !== "AbortError") {
          dispatch({
            type: "FETCH_ERROR",
            payload: error.message,
          });
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fetchFunction, ...inputs]);

  return state;
}
