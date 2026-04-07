import { createRootRoute, Outlet } from "@tanstack/react-router"

import Footer from "@/components/footer/footer"
import Navbar from "@/components/header/navbar"

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
