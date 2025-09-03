import axios from "axios";
import { User } from "../types/User";

// הנתונים הדרושים לעדכון המשתמש והסוג שלהם
interface UpdateProfileData {
  userName: string;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

// שליפת נתוני המשתמש המחובר מהשרת
export const getUser = async (): Promise<User> => {
  const res = await axios.get<User>("http://localhost:5000/api/user", {
    withCredentials: true,
  });
  return res.data;
};

// מחיקת המשתמש מהDB
export const deleteUserApi = async () => {
  return await axios.delete("http://localhost:5000/api/user/delete", {
    withCredentials: true,
  });
};

// עדכון פרטי המשתמש
export const updateUserApi = async (data: UpdateProfileData) => {
  return await axios.put("http://localhost:5000/api/user/profile", data, {
    withCredentials: true,
  });
};
