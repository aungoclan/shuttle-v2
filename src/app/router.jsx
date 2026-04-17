import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminProtectedRoute from "../auth/AdminProtectedRoute";

const HomePage = lazy(() => import("../pages/public/HomePage"));
const BookPage = lazy(() => import("../pages/public/BookPage"));
const ContactPage = lazy(() => import("../pages/public/ContactPage"));
const ServicesPage = lazy(() => import("../pages/public/ServicesPage"));
const AboutPage = lazy(() => import("../pages/public/AboutPage"));

const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminBookingsPage = lazy(() => import("../pages/admin/AdminBookingsPage"));
const AdminBookingDetailPage = lazy(() =>
  import("../pages/admin/AdminBookingDetailPage")
);

function withSuspense(element) {
  return (
    <Suspense fallback={<div style={{ padding: "24px" }}>Loading...</div>}>
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "book", element: withSuspense(<BookPage />) },
      { path: "contact", element: withSuspense(<ContactPage />) },
      { path: "services", element: withSuspense(<ServicesPage />) },
      { path: "about", element: withSuspense(<AboutPage />) },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<AdminDashboard />) },
      { path: "bookings", element: withSuspense(<AdminBookingsPage />) },
      {
        path: "bookings/:id",
        element: withSuspense(<AdminBookingDetailPage />),
      },
    ],
  },
  {
    path: "/admin/login",
    element: withSuspense(<AdminLogin />),
  },
]);