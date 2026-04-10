import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import BookPage from "../pages/public/BookPage";
import ContactPage from "../pages/public/ContactPage";
import ServicesPage from "../pages/public/ServicesPage";
import AboutPage from "../pages/public/AboutPage";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminBookingsPage from "../pages/admin/AdminBookingsPage";
import AdminBookingDetailPage from "../pages/admin/AdminBookingDetailPage";

import AdminProtectedRoute from "../auth/AdminProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "book", element: <BookPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "about", element: <AboutPage /> },
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
      { index: true, element: <AdminDashboard /> },
      { path: "bookings", element: <AdminBookingsPage /> },
      { path: "bookings/:id", element: <AdminBookingDetailPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
]);