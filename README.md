# Design Decisions and Technical Explanations

## 1. State Choices

The signed-in user is stored in **AuthContext** and managed using `useReducer` because authentication state is needed by multiple components. The cart is stored in a **Zustand store** because many components need to read and update it frequently. Filter values are stored in the **URL query string** using `useSearchParams`, while the product list is loaded from the API using the `useFetch` custom hook. The theme is stored in `localStorage` through the `useLocalStorage` custom hook so the user's preference survives page reloads.

## 2. Context Versus Store

I use Context for the signed-in user because authentication information is shared across the application and does not change frequently. I use Zustand for the cart because it changes frequently and is accessed by multiple components, such as the Navbar, ProductCard, ProductDetail, and Cart. If I used Context for the cart, frequent updates could cause unnecessary re-renders in components that consume the context.

## 3. Custom Hooks

The `useFetch` hook shares the data-fetching logic between `ProductList` and `ProductDetail`, including loading states, error handling, and request cancellation. However, it deliberately does not share the actual product data or state between these components. Each component has its own hook instance and manages its own request independently.

## 4. Route Parameters

The `id` read using `useParams()` is a **string**, not a number. This matters when fetching a product because the API URL is built using the ID, and when comparing or performing numeric operations on it, such as converting it with `Number(id)` for the next product link.

## 5. Protected Routes

My `ProtectedRoute` provides client-side navigation protection, but it is not real security because users can inspect or modify client-side code and bypass these checks. A real application needs a secure backend that verifies authentication and authorization on every protected request, using secure session handling or properly validated tokens.

## 6. Deep Links

If this application were deployed on a plain static file server without SPA fallback configuration, reloading `/products/3` could return a 404 because the server would look for a physical file at that path. It works on the Vite development server because Vite supports SPA fallback and serves the application's `index.html` for client-side routes.

# Self-Study and Official Documentation Research

## 1. Updating URL Query Parameters

I researched the official React Router documentation for `useSearchParams`. I learned that I can create a copy of the current query parameters using `new URLSearchParams(searchParams)`, then update only the parameter I need using `.set()` or `.delete()`. I applied this in `ProductList.jsx` so changing the category does not remove the search text, and changing the search text does not remove the selected category.

**Official documentation:**  
https://reactrouter.com/api/hooks/useSearchParams

## 2. Initialising Zustand from localStorage

I researched the official Zustand documentation about creating stores and subscribing to state changes. I learned that I can initialise the store using data loaded from `localStorage`, and use `subscribe()` to save changes whenever the store state is updated. In my `cartStore.js`, I use `JSON.parse()` inside a try/catch block and check `Array.isArray()` to handle missing, corrupted, or invalid saved data safely. I also use immutable operations such as `map()`, `filter()`, and the spread operator when updating cart items.

**Official documentation:**  
https://zustand.docs.pmnd.rs/reference/apis/create  
https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data

## 3. Implementing a Light/Dark Theme

I researched how CSS classes and CSS custom properties can be used to implement different themes. I applied this idea by storing the theme preference with my `useLocalStorage` custom hook and applying a theme class to the main application wrapper in `Layout.jsx`. My CSS uses different background and text colours for light and dark modes, and the saved preference is restored when the application reloads.

**Official documentation:**  
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage  
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

## 4. What I Learned

This research helped me understand how URL parameters, persistent browser storage, Zustand subscriptions, and CSS classes can work together in a React application. I also learned that choosing the correct place for state makes an application easier to maintain and understand.

# Project File Organization

The project is organized into separate folders to keep the application modular, readable, and maintainable.

- `src/api/`: Contains API functions for fetching products and handling login.
- `src/hooks/`: Contains reusable custom hooks, including `useFetch` and `useLocalStorage`.
- `src/context/`: Contains `AuthContext` for managing authentication state.
- `src/store/`: Contains the Zustand cart store and cart actions.
- `src/components/`: Contains reusable UI components such as `Layout`, `NavBar`, `ProductCard`, and `ProtectedRoute`.
- `src/pages/`: Contains application pages such as Home, ProductList, ProductDetail, Cart, Login, and NotFound.
- `src/App.jsx`: Defines the application routes.
- `src/main.jsx`: Initializes React, BrowserRouter, and AuthProvider.
- `src/index.css` and `src/App.css`: Contain the application's global and component styling.
- `public/`: Contains static assets.
- `package.json`: Defines project dependencies and scripts.
- `README.md`: Documents the project structure, technical decisions, research, and challenges.



# Challenges Faced

During development, I faced several challenges:

1. **API Request Handling:** Managing loading and error states while fetching products. I addressed this by creating a reusable `useFetch` custom hook with request cancellation.
2. **Cart Persistence:** Making sure cart items remain available after refreshing the page. I used Zustand with localStorage initialization and a store subscription to persist changes.
3. **URL-Based Filtering:** Updating search and category filters without losing existing query parameters. I solved this using `useSearchParams` and `URLSearchParams`.
4. **Authentication and Protected Routes:** Managing login state across components and preventing unauthenticated users from accessing the cart page. I implemented `AuthContext`, `useReducer`, and `ProtectedRoute`.
5. **Theme Persistence:** Keeping the selected theme after a page reload. I used `useLocalStorage` and theme classes in the application layout.