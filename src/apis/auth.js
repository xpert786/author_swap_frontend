import apiClient from "./client";

export const login = async (data) => {
  const response = await apiClient.post("login/", data);
  return response.data;
};

export const signup = async (data) => {
  const response = await apiClient.post("signup/", data);
  return response.data;
};

export const forgetPassword = async (data) => {
  const response = await apiClient.post("forgot-password/", data);
  return response.data;
};

export const otpVerification = async (data) => {
  const response = await apiClient.post("verify-otp/", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await apiClient.post("reset-password/", data);
  return response.data;
};