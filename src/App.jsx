import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./components/routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationContext";
import { ProfileProvider } from "./context/ProfileContext";

function App() {
  return (
    <ProfileProvider>
      <NotificationProvider>
        <BrowserRouter basename="/authorswap-frontend">

          {/* Global Toast Container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "rgb(58, 141, 139)",
                color: "#fff",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "500",
                padding: "12px 20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                borderBottom: "3px solid #E07A5F",
                minWidth: "280px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              },
              success: {
                style: {
                  borderBottom: "3px solid #E07A5F",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "rgb(58, 141, 139)",
                },
              },
              error: {
                style: {
                  borderBottom: "3px solid #EF4444",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#EF4444",
                },
              },
            }}
          />

          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ProfileProvider>
  );
}

export default App;