import axios from "axios";
import { AddressFormData } from "../types/Address";

// הנתונים הדרושים למערך של מוצרים
interface CartItemPayment {
  productId: string;
  name: string;
  price: number;
  amount: number;
  imageUrl: string;
}

// הנתונים הדרושים לתשלום
interface DataPayment {
  items: CartItemPayment[];
  totalPrice: string;
  address: AddressFormData;
}

// בקשת תשלום
export const paymentApi = async (data: DataPayment) => {
  return await axios.post(
    "http://localhost:5000/api/payment/capture-order",
    data,
    {
      withCredentials: true,
    }
  );
};
