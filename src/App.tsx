import { useRoutes } from "react-router-dom";
import './App.css';
import Comics from "./Pages/Comics";
import ComicDetails from "./Pages/ComicDetails";
import Layout from "./Pages/Layout";
import Favorite from "./Pages/Favorite";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "comics",
          index: true,
          element: <Comics />,
        },
        {
          path: "comics/:id",
          element: <ComicDetails />,
        },
        {
          path: "favorites",
          element: <Favorite />,
        }
      ],
    },
  ]);

  return element;
}

export default App;