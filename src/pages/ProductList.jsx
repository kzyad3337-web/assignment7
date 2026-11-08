
import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";
import useFetch from "../hooks/useFetch";
import { fetchProducts } from "../api/productsApi";

function ProductList() {
  const { data, loading, error } = useFetch(fetchProducts);

  const [searchParams, setSearchParams] = useSearchParams();

  // Read filter values from the URL
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  // Loading state
  if (loading) {
    return <h2>Loading products...</h2>;
  }

  // Error state
  if (error) {
    return <h2>Error: {error}</h2>;
  }
if (!Array.isArray(data)) {
  return <h2>Products data is unavailable.</h2>;
}
  // Derive categories from loaded products
  const categories = [
    ...new Set(data.map((product) => product.category)),
  ];

  // Derive filtered products during render
  const filteredProducts = data.filter((product) => {
    const matchesTitle = product.title
      .toLowerCase()
      .includes(q.toLowerCase());

    const matchesCategory =
      !category || product.category === category;

    return matchesTitle && matchesCategory;
  });

  // Update URL query parameters
  function updateFilter(key, value) {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  }

  return (
    <section>
      <h1>Products Catalogue</h1>

      {/* Search by title */}
      <input
        type="text"
        placeholder="Search by product title..."
        value={q}
        onChange={(e) => updateFilter("q", e.target.value)}
      />

      {/* Filter by category */}
      <select
        value={category}
        onChange={(e) => updateFilter("category", e.target.value)}
      >
        <option value="">All Categories</option>

        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <p>Products found: {filteredProducts.length}</p>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <h2>No products found.</h2>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
