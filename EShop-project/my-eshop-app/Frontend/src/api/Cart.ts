import axios from "axios";

// הנתונים להוספה לעגלה
interface DataAddToCart {
  productId: string;
  amount: number;
}

// הנתונים לשינוי כמות המוצר
interface DataUpdateItem {
  productId: string;
}

interface DataItems {
  productId: string;
  amount: number;
}
interface DataSyncCart {
  items: DataItems[];
}

// משיכת העגלה
export const fetchCart = async () => {
  const res = await axios.get("http://localhost:5000/api/cart", {
    withCredentials: true,
  });
  return res.data;
};

// הוספה לעגלה
export const addToCartApi = async (data: DataAddToCart) => {
  const res = await axios.post(`http://localhost:5000/api/cart/addItem`, data, {
    withCredentials: true,
  });
  return res.data;
};

// הוספת כמות מוצר אחד לעגלה
export const addOneItemCart = async (data: DataUpdateItem) => {
  const res = await axios.put(
    `http://localhost:5000/api/cart/addOneItem`,
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

// הסרת כמות מוצר אחד לעגלה
export const removeOneItemCart = async (data: DataUpdateItem) => {
  const res = await axios.put(
    `http://localhost:5000/api/cart/removeOneItem`,
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

// הסרת מוצר מהעגלה
export const removeItemCart = async (data: DataUpdateItem) => {
  const res = await axios.delete(`http://localhost:5000/api/cart/removeItem`, {
    withCredentials: true,
    data,
  });
  return res.data;
};
export const syncCart = async (data: DataSyncCart) => {
  await axios.post(`http://localhost:5000/api/cart/sync`, data, {
    withCredentials: true,
  });
};

export const clearCartApi = async () => {
  await axios.delete(`http://localhost:5000/api/cart/clear`, {
    withCredentials: true,
  });
};
