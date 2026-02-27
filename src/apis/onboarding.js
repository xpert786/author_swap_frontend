import apiClient from "./client";

export const onboardingStep1 = async (formData) => {
  const response = await apiClient.post(
    "onboarding/account-basics/",
    formData
  );
  return response.data;
};

export const onboardingStep2 = async (formData) => {
  const response = await apiClient.post(
    "onboarding/online-presence/",
    formData
  );
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get("profile/review/");
  return response.data;
};

export const editPenName = async (penName) => {
  const response = await apiClient.patch("edit-pen-name/", {
    pen_name: penName,
  });
  return response.data;
};

export const connectMailerlite = async (data) => {
  const response = await apiClient.post("connect-mailerlite/", data);
  return response.data;
};
