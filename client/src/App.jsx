import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Homepage from "../pages/Homepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "", element: <Homepage /> }

    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
