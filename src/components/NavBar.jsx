
import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import useCartStore from "../store/cartStore";

function NavBar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();

  const itemCount = useCartStore((state) =>
    state.items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav>
      <NavLink to="/" end className={getLinkClass}>
        Home
      </NavLink>

      <NavLink to="/products" className={getLinkClass}>
        Products
      </NavLink>

      <NavLink to="/cart" className={getLinkClass}>
        Cart ({itemCount})
      </NavLink>

      {user ? (
        <>
          <span>Welcome, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <NavLink to="/login" className={getLinkClass}>
          Login
        </NavLink>
      )}

      <button onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
    </nav>
  );
}

export default NavBar;
