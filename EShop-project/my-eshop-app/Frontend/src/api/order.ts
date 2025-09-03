import axios from "axios";

export const getOrderApi = async (id: string) => {
  return await axios.get(`http://localhost:5000/api/order/${id}`, {
    withCredentials: true,
  });
};

export const OrderUpdateDelivered = async (id: string) => {
  return await axios.put(
    `http://localhost:5000/api/order/${id}`,
    {},
    { withCredentials: true }
  );
};

export const getAllOrderApi = async () => {
  return await axios.get(`http://localhost:5000/api/order`, {
    withCredentials: true,
  });
};
