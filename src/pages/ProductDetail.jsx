
import { useParams, useNavigate, Link } from "react-router";
import { fetchProduct } from "../api/productsApi";
import useFetch from "../hooks/useFetch";
import useCartStore from "../store/cartStore";

// Keep this function outside the component
function fetchProductById(signal, id) {
  return fetchProduct(id, signal);
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, loading, error } = useFetch(
    fetchProductById,
    [id]
  );

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  // Loading state
  if (loading) {
    return <h2>Loading product...</h2>;
  }

  // Error state
  if (error) {
    return (
      <section>
        <h2>
          {error === "Product not found"
            ? "Product not found"
            : `Error: ${error}`}
        </h2>

        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </section>
    );
  }

  // Safety check
  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <section>
      <h1>{product.title}</h1>

      <img
        src={product.thumbnail}
        alt={product.title}
        width="300"
      />

      <p>{product.description}</p>

      <p>Price: ${product.price}</p>

      <p>Category: {product.category}</p>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      <button onClick={() => navigate("/products")}>
        Back
      </button>

      <p>
        <Link to={`/products/${Number(id) + 1}`}>
          Next Product
        </Link>
      </p>
    </section>
  );
}

export default ProductDetail;
