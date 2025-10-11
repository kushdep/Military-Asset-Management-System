import { RouterProvider, createBrowserRouter, useSearchParams } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import PurchasePage from "./pages/PurchasePage";
import LoginRoute from "./auth-routes/LoginRoute";
import DashRoute from "./auth-routes/DashRoute";
import AssignAsset from "./pages/AssignAsset";
import TransferAsset from "./pages/TransferAssets";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoute />,
    errorElement:<ErrorPage/>
  },
  { path: "login", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: (
      <DashRoute>
        <AppLayout />
      </DashRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Dashboard /> },
      {
        path: ":id",
        children: [
          { path: "", element: <Dashboard /> },
          { path: "purchase", element: <PurchasePage /> },
          { path: "assign", element: <AssignAsset/> },
          { path: "expenditure", element: <AssignAsset/> },
          { path: "transfer", element: <TransferAsset/> },
        ],
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
