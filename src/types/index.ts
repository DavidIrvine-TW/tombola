/**
 * Shared TypeScript Type Definitions
 *
 * These interfaces define the shape of data used throughout the app.
 * They're shared between components, API calls, and hooks to ensure
 * type safety across the entire frontend.
 */

/**
 * Represents a coffee bean product from the database.
 * Matches the shape returned by the /api/beans endpoints.
 */
export interface Bean {
  id: number;          // Unique database ID
  index: number;       // Original display order index
  isBOTD: number;      // 0 = not Bean of the Day, 1 = is Bean of the Day
  cost: string;        // Price as a string, e.g. "£39.26"
  image: string;       // URL to the bean's image
  colour: string;      // Roast type, e.g. "dark roast", "green", "golden"
  name: string;        // Product name, e.g. "TURNABOUT"
  description: string; // Full text description
  country: string;     // Country of origin, e.g. "Brazil"
}

/**
 * The data sent to POST /api/orders when placing a new order.
 * Does not include totalCost or createdAt - those are calculated server-side.
 */
export interface OrderInput {
  beanId: number;       // ID of the bean being ordered
  customerName: string; // Customer's full name
  email: string;        // Customer's email address
  quantity: number;     // Number of units to order
}

/**
 * Represents a completed order as stored in the database.
 * Returned by the API after an order is created.
 */
export interface Order {
  id: number;           // Unique order ID
  beanId: number;       // ID of the bean that was ordered
  customerName: string; // Customer's full name
  email: string;        // Customer's email address
  quantity: number;     // Number of units ordered
  totalCost: string;    // Calculated total, e.g. "£78.52"
  createdAt: string;    // ISO 8601 timestamp of when the order was placed
}

/**
 * Tracks the current state of the search and filter controls.
 * Used by the SearchFilter component and the main page to
 * synchronise the UI with the API query parameters.
 */
export interface FilterState {
  search: string;  // Free text search term (searches name, description, country)
  country: string; // Selected country filter (empty string = all countries)
  colour: string;  // Selected roast type filter (empty string = all roasts)
}
