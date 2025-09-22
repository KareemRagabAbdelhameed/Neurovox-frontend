import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "./Sidebar"

const MainLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex lg:space-x-6 dark:bg-gray-900">
        <Sidebar />
      <div className="mt-8">
        <Outlet />
      </div>
      </div>
    </div>
  )
}

export default MainLayout
