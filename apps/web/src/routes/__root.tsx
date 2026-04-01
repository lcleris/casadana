import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navigation from "@/components/header/navigation";
import Footer from "@/components/footer/footer";

const RootLayout = () => {
  console.log(import.meta.url);
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
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
