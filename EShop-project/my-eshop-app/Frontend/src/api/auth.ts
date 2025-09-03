import axios from "axios";

// הנתונים להתחברות
interface LoginData {
  email: string;
  password: string;
}

// הנתונים להרשמה
interface RegisterData {
  userName: string;
  email: string;
  password: string;
}

// הנתונים לשכחתי את הסיסמא
interface ForgotPasswordData {
  email: string;
}

// הנתונים לשנות את הסיסמא
interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// התחברות משתמש
export const loginUser = async (data: LoginData) => {
  return await axios.post("http://localhost:5000/api/auth/login", data, {
    withCredentials: true,
  });
};

// הרשמה משתמש
export const registerUser = async (data: RegisterData) => {
  return await axios.post("http://localhost:5000/api/auth/register", data, {
    withCredentials: true,
  });
};

export const verifyUserApi = async (userId: string, token: string) => {
  return await axios.get(
    `http://localhost:5000/api/auth/verify/${userId}/${token}`,
    { withCredentials: true }
  );
};

// התנתקות משתמש
export const logoutUser = async () => {
  return await axios.post(
    "http://localhost:5000/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
};

// שכחתי את הסיסמא
export const forgotPasswordApi = async (data: ForgotPasswordData) => {
  return await axios.post(
    "http://localhost:5000/api/auth/forgotPassword",
    data,
    {
      withCredentials: true,
    }
  );
};

// משנה את הסיסמא
export const resetPasswordApi = async (data: ResetPasswordData) => {
  return await axios.put("http://localhost:5000/api/auth/resetPassword", data, {
    withCredentials: true,
  });
};
