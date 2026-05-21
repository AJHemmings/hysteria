import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import LoginForm from './components/admin/LoginForm';
import ResetPassword from './pages/ResetPassword';

function HomeOrInvite() {
  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);
  const authType = params.get('type') ?? new URLSearchParams(hash.slice(1)).get('type');
  if (authType === 'invite' || authType === 'recovery') {
    return <Navigate to={`/admin/reset-password${window.location.search}${hash}`} replace />;
  }
  return <Home />;
}

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
  { path: '/', element: <HomeOrInvite /> },
  { path: '/admin/login', element: <LoginForm /> },
  { path: '/admin/reset-password', element: <ResetPassword /> },
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

