import { api } from "./api";

// שליפת הזמנה לפי ID
export const getOrderApi = async (id: string) => {
  return await api.get(`/order/${id}`);
};

// עדכון סטטוס הזמנה לפי ID
export const OrderUpdateDelivered = async (id: string) => {
  return await api.put(`/order/${id}`, {});
};

// שליפת כל ההזמנות
export const getAllOrderApi = async () => {
  return await api.get(`/order`);
};
