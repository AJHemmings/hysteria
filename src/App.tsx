import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import LoginForm from './components/admin/LoginForm';

function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

// Router is created once at module level — this is valid because
// ProtectedRoute only calls useAuth() when React renders it,
// at which point it will be inside the AuthProvider tree.
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/admin/login', element: <LoginForm /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/admin', element: <Admin /> }],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

