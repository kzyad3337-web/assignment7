
import { create } from "zustand";

const STORAGE_KEY = "shop-cart";

// Step 1: Load cart from localStorage
function loadCart() {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      return [];
    }

    const parsedItems = JSON.parse(savedItems);

    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
}

// Step 2: Create Zustand store
const useCartStore = create((set) => ({
  items: loadCart(),

  // Add item
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
          },
        ],
      };
    }),

  // Remove item
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  // Update quantity
  setQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity < 1
          ? state.items.filter((item) => item.id !== id)
          : state.items.map((item) =>
              item.id === id
                ? { ...item, quantity }
                : item
            ),
    })),

  // Clear cart
  clear: () => set({ items: [] }),
}));

// Step 3: Save cart outside React
useCartStore.subscribe((state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state.items)
    );
  } catch (error) {
    console.error("Error saving cart:", error);
  }
});

export default useCartStore;
