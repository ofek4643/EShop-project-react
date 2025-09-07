import Order from "../models/Order";

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const updateDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ error: "ההזמנה לא נמצאה" });
    }
    if (order.isDelivered) {
      return res.status(400).json({ error: "ההזמנה כבר נשלחה" });
    }
    order.isDelivered = true;
    await order.save();

    return res.status(200).json({ message: "נהדר! שמחים שהזמנה הגיעה" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const getAllOrderUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const getOrdersAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const deleteOrdersAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    return res.status(200).json("הזמנה נמחקה בהצלחה");
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};
