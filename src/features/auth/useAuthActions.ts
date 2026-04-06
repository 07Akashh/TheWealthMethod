import { useState } from "react";

import { UserRole } from "../../constants/roles";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

type SignupPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
};

export const useAuthActions = () => {
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

  const loginWithEmail = async (email: string, _pin: string) => {
    setLoading(true);
    try {
      // Send OTP after verifying email/pin (mocked)
      await authService.sendOtp(email);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhone = async (phone: string) => {
    setLoading(true);
    try {
      await authService.sendOtp(phone);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phoneOrEmail: string, otp: string) => {
    setLoading(true);
    try {
      const result = await authService.verifyOtp(phoneOrEmail, otp);
      loginStore(result);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    try {
      const result = await authService.signup(payload);
      loginStore(result);
      return true;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loginWithEmail,
    loginWithPhone,
    verifyOtp,
    signup,
    logout: logoutStore,
    login: loginStore, // Expose raw login for bypass or edge cases
  };
};
