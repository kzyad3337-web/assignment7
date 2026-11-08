
import { Link } from "react-router";
import useCartStore from "../store/cartStore";

function ProductCard({ product }) {
  // Select only the action needed by this component
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article>
      <img
        src={product.thumbnail}
        alt={product.title}
        width="180"
      />

      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>

      <Link to={`/products/${product.id}`}>
        View Details
      </Link>

      <br />

      <button onClick={() => addItem(product)}>
        Add to Cart
      </button>
    </article>
  );
}

export default ProductCard;
