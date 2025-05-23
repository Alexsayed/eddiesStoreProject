import { Products } from "../models/products";
export type SortOption = | "priceAscending" | "priceDescending" | "newest" | "nameAscending" | "nameDescending" | "default";
// Handle Sort products
export const sortProducts = (productsData: Products[], sortOption: SortOption): Products[] => {
  // Store shalow copy of productsData
  const sorted = [...productsData];
  // Handle sort options
  switch (sortOption) {
    case "priceAscending":
      return sorted.sort((a, b) => a.price - b.price);
    case "priceDescending":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    case "nameAscending":
      return sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    case "nameDescending":
      return sorted.sort((a, b) => b.productName.localeCompare(a.productName));
    default:
      return productsData;
  }
};






