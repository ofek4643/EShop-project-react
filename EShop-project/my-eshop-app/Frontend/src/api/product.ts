import axios from "axios";
import { Product } from "../types/Product";

// משיכת המוצרים מהשרת
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(
    "https://eshop-project-react.onrender.com/api/product",
    {
      withCredentials: true,
    }
  );
  return res.data;
};

// משיכת מוצר על פי ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await axios.get<Product>(
    `http://localhost:5000/api/product/${id}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
