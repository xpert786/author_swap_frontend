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
              duration: 3000,
              className:
                "bg-zinc-900 text-white rounded-lg shadow-lg px-4 py-3",
            }}
          />

          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ProfileProvider>
  );
}

export default App;