import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Login and Register/Login"
import AdminDashBoard from "./admin/AdminDashBoard"
import Layout from "./Layout/Layout"
import MyRequest from "./Pages/MyRequest"
import RequestBook from "./Pages/RequestBook"
import AllBook from "./Pages/AllBook"
import MyBook from "./Pages/MyBook"
import AddBook from "./Pages/AddBook"
import Profile from "./Pages/Profile"
import "./App.css"
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/admin",
      element: <AdminDashBoard></AdminDashBoard>
    },
    {
      path: "/home",
      element: <Layout />,
      children: [
        {
          path: "myrequests",
          element: <MyRequest />
        },
        {
          path: "requestbook",
          element: <RequestBook />
        },
        {
          path: "allbook",
          element: <AllBook />
        },
        {
          path: "mybook",
          element: <MyBook />
        },
        {
          path: "addbook",
          element: <AddBook />
        },
        {
          path: "profile",
          element: <Profile />
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default App
