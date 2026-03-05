import { createBrowserRouter, RouterProvider, Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * 🚀 MERN STACK ARCHITECTURE - BACKEND & DATABASE INTEGRATION GUIDE
 * =================================================================
 * This project is ready to be connected to a MERN backend. 
 * Below is the blueprint for the second developer:
 * 
 * 1. NODE.JS / EXPRESS BACKEND:
 *    - Create a 'backend' folder in the root.
 *    - Setup an Express server with routes for /api/stocks, /api/auth, and /api/portfolio.
 * 
 * 2. MONGODB DATABASE:
 *    - Use Mongoose to connect to your MongoDB Atlas cluster.
 *    - Collections needed: 'Users' (for profiles), 'Stocks' (for info), 'Transactions' (for orders).
 * 
 * 3. CONNECTION LOGIC:
 *    - In the frontend, replace mock data services (stockService.js) with Axios calls.
 *    - Use JWT Tokens for session persistence in ProtectedRoute.
 * 
 * 📍 CHECK MARKERS: Look for '📍 BACKEND INTEGRATION' comments in:
 *    - /src/services/stockService.js
 *    - /src/pages/Login.jsx
 *    - /src/pages/Dashboard.jsx
 *    - /src/pages/Register.jsx
 */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Markets from "./pages/Markets";
import StockDetail from "./pages/StockDetail";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Calculator from "./pages/Calculator";
import Resources from "./pages/Resources";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Protected Route Component - Persists login after refresh
const ProtectedRoute = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");
  const authToken = localStorage.getItem("authToken");

  if (!currentUser || !authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route - Redirects logged-in users to dashboard
const PublicRoute = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");
  const authToken = localStorage.getItem("authToken");

  if (currentUser && authToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout component that wraps pages with Navbar and Footer
function Layout() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    currentUser: null
  });

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("currentUser");
      const token = localStorage.getItem("authToken");
      setAuthState({
        isAuthenticated: !!(user && token),
        currentUser: user ? JSON.parse(user) : null
      });
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar authState={authState} setAuthState={setAuthState} />
      <div className="flex-grow">
        <Outlet context={{ authState, setAuthState }} />
      </div>
      <Footer />
    </div>
  );
}

// Create the router with future flags
const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomeWrapper /> },
        {
          path: "/register",
          element: (
            <PublicRoute>
              <Register />
            </PublicRoute>
          ),
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          ),
        },
        {
          path: "/forgot-password",
          element: (
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          ),
        },
        {
          path: "/reset-password",
          element: (
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        { path: "/markets", element: <Markets /> },
        { path: "/stock/:symbol", element: <StockDetail /> },
        { path: "/calculator", element: <Calculator /> },
        { path: "/resources", element: <Resources /> },
        {
          path: "/watchlist",
          element: (
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          ),
        },
        {
          path: "/portfolio",
          element: (
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/wallet",
          element: (
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// Wrapper to pass authState via Outlet context
function HomeWrapper() {
  const { authState } = useOutletContext();
  return <Home authState={authState} />;
}

export default function App() {
  return <RouterProvider router={router} />;
}
