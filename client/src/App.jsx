import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../components/LoginPage";
import PurchasePage from "../pages/PurchasePage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <AppLayout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "purchase", element: <PurchasePage /> },
    ],
  }
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
