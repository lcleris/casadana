import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/header/navbar";
import Footer from "@/components/footer/footer";

const RootLayout = () => {
  console.log(import.meta.url);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
