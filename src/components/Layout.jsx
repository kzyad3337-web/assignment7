
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import useLocalStorage from "../hooks/useLocalStorage";

function Layout() {
  const [theme, setTheme] = useLocalStorage("shop-theme", "light");

  function toggleTheme() {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  }

  return (
    <div className={`app ${theme}-theme`}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Outlet />
      </main>

      <footer>
        <p>Online Shop - Assignment 7</p>
        <p>All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
