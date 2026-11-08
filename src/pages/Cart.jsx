
import { Link } from "react-router";
import useCartStore from "../store/cartStore";

function Cart() {
  // Select the existing items reference
  const items = useCartStore((state) => state.items);

  // Select only the actions needed
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clear = useCartStore((state) => state.clear);

  // Derived values: do not store these in Zustand
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <section>
        <h1>Your Cart</h1>
        <h2>Your cart is empty.</h2>
        <Link to="/products">Continue Shopping</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your Cart</h1>

      {items.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>

          <p>Price: ${item.price}</p>

          <p>Quantity: {item.quantity}</p>

          <button
            onClick={() =>
              setQuantity(item.id, item.quantity - 1)
            }
          >
            -
          </button>

          <button
            onClick={() =>
              setQuantity(item.id, item.quantity + 1)
            }
          >
            +
          </button>

          <button onClick={() => removeItem(item.id)}>
            Remove
          </button>

          <p>
            Subtotal: ${(item.price * item.quantity).toFixed(2)}
          </p>
        </article>
      ))}

      <h2>Total: ${totalPrice.toFixed(2)}</h2>

      <button onClick={clear}>
        Clear Cart
      </button>

      <p>
        <Link to="/products">Continue Shopping</Link>
      </p>
    </section>
  );
}

export default Cart;
