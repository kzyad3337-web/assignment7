
import { createContext, useContext, useReducer } from "react";
import { login } from "../api/authApi";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  loading: false,
  error: null,
  theme: "light",
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };

    default:
      return state;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [savedUser, setSavedUser] = useLocalStorage(
    "shop-user",
    null
  );

  const [savedTheme, setSavedTheme] = useLocalStorage(
    "shop-theme",
    "light"
  );

  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    user: savedUser,
    theme: savedTheme,
  });

  async function handleLogin(username, password) {
    dispatch({ type: "LOGIN_START" });

    try {
      const user = await login(username, password);

      setSavedUser(user);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      return true;
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error.message,
      });

      return false;
    }
  }

  function handleLogout() {
    setSavedUser(null);
    dispatch({ type: "LOGOUT" });
  }

  function toggleTheme() {
    const newTheme =
      state.theme === "light" ? "dark" : "light";

    setSavedTheme(newTheme);

    dispatch({
      type: "SET_THEME",
      payload: newTheme,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        theme: state.theme,
        login: handleLogin,
        logout: handleLogout,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
