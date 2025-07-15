import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import NotesListPage from './pages/NotesListPage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { toast } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [auth, setAuth] = useState({ user: null });

  // Remove localStorage logic

  // Handle login
  const handleLogin = (data) => {
    setAuth({ user: data.user });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Logout failed');
      setAuth({ user: null });
      toast.success('Logged out successfully!');
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

  return (
    <div className={darkMode ? 'dark min-h-screen bg-gray-900 text-white' : 'min-h-screen bg-gray-100 text-gray-900'}>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Header auth={auth} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route
            path="/"
            element={auth.user ? <NotesListPage /> : <Navigate to="/login" replace />} />
          <Route
            path="/create"
            element={auth.user ? <CreateNotePage /> : <Navigate to="/login" replace />} />
          <Route
            path="/edit/:id"
            element={auth.user ? <EditNotePage /> : <Navigate to="/login" replace />} />
          <Route
            path="/register"
            element={!auth.user ? <RegisterPage /> : <Navigate to="/" replace />} />
          <Route
            path="/login"
            element={!auth.user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

function Header({ auth, onLogout, darkMode, setDarkMode }) {
  const location = useLocation();
  return (
    <div className="flex justify-end p-4 gap-2">
      <button
        className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-700 transition"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {auth.user ? (
        <button
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          onClick={onLogout}
        >
          Logout
        </button>
      ) : (
        <>
          {location.pathname !== '/login' && (
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
          {location.pathname !== '/register' && (
            <Link
              to="/register"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
            >
              Register
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default App;
