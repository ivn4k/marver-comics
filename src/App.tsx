import { useRoutes, Navigate } from "react-router-dom";
import './App.css';
import Comics from "./Pages/ComicsPage/Comics";
import ComicDetails from "./Pages/ComicDetails/ComicDetails";
import Layout from "./Pages/Layout/Layout";
import Favorite from "./Pages/FavoritePage/Favorite";
import TestPage from "./Pages/TestPage/TestPage";

function App() {
  let element = useRoutes([
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
          element: <Comics />,
          children: [
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

  return element;
}

export default App;