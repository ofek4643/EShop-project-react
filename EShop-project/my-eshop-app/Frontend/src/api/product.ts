import axios from "axios";
import { Product } from "../types/Product";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/";

// משיכת המוצרים מהשרת
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(`${BASE_URL}product`, {
    withCredentials: true,
  });
  return res.data;
};

// משיכת מוצר על פי ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await axios.get<Product>(`${BASE_URL}product/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
