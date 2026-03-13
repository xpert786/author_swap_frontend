import apiClient from "./client";

export const exportGoogleCalendar = async () => {
  const response = await apiClient.get("/calendar/google/");
  return response.data;
};

export const exportOutlookCalendar = async () => {
  const response = await apiClient.get("/calendar/outlook/");
  return response.data;
};

export const exportICSCalendar = async () => {
  const response = await apiClient.get("/calendar/ics/");
  return response.data;
};
