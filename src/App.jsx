import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "./components/routes/AppRoutes";

function App() {
  return (
    <BrowserRouter basename="/authorswap-frontend">
        <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
