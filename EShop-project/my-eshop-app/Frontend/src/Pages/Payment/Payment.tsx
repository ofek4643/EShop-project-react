import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from "./Payment.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "../../utils/errorHandler";
import { paymentApi } from "../../api/payment";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { clearUserCart } from "../../store/slices/cartSlice";
import { clearCartApi } from "../../api/Cart";
import { AddressFormData } from "../../types/Address";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const savedAddress = localStorage.getItem("currentAddress");
  const address: AddressFormData | null = savedAddress
    ? JSON.parse(savedAddress)
    : null;

  //חישוב סכום העגלה
  const userCart = useSelector((state: RootState) => state.cart.userCart);
  const totalPrice = userCart.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );
  const totalPriceStr = totalPrice.toFixed(2);

  // פונקציה ששולחת את פרטי ההזמנה ל-backend לאחר אישור התשלום
  const handleCaptureOrder = async () => {
    if (!address) {
      toast.error("לא נמצאה כתובת למשלוח");
      return;
    }
    try {
      const res = await paymentApi({
        items: userCart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          amount: item.amount,
          imageUrl: item.imageUrl,
        })),
        totalPrice: totalPriceStr,
        address,
      });

      dispatch(clearUserCart());
      await clearCartApi();
      localStorage.removeItem("currentAddress");
      const orderId = res.data.order._id;
      navigate(`/order/${orderId}`);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "ILS",
      }}
    >
      <div className={styles.main}>
        <div className={styles.container}>
          <h2 className={styles.title}>אפשרויות תשלום</h2>

          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(_, actions) => {
              return actions.order?.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "ILS",
                      value: totalPriceStr,
                    },
                  },
                ],
              });
            }}
            onApprove={async (_data, actions) => {
              if (!actions?.order) {
                toast.error("קרתה שגיאה: Order לא קיים");
                return;
              }

              const details = await actions.order.capture();

              const orderID = details.id;
              if (!orderID) {
                toast.error("קרתה שגיאה: Order ID לא קיים");
                return;
              }
              toast.success(`התשלום בוצע בהצלחה!`);
              await handleCaptureOrder();
            }}
          />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Payment;
