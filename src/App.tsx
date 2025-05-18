import { useRoutes, Navigate } from "react-router-dom";
import './App.css';
import Comics from "./Pages/ComicsPage/Comics";
import ComicDetails from "./Pages/ComicDetails/ComicDetails";
import Layout from "./Pages/Layout/Layout";
import Favorite from "./Pages/FavoritePage/Favorite";
import TestPage from "./Pages/TestPage/TestPage";
import StoreProvider from "./store/StoreProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Navigate to="/comics" replace/>,
        },
        {
          path: "comics",
          children: [
            {
              path: "",
              element: <Comics />
            },
            { 
              path: ":id", 
              element: <ComicDetails />,
            },
          ],
        },
        {
          path: "favorites",
          element: <Favorite />,
        },
        {
          path: "test",
          element: <TestPage />,
        }
      ],
    },
  ]);

  return (
    <StoreProvider>
      {element}
      <ToastContainer position="top-right" autoClose={3000} />
    </StoreProvider>
  );
}

export default App;