import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiUsers } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className="nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-inner">
        {/* Logo */}
        <motion.button
          className="nav-logo"
          onClick={() => navigate('/dashboard')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="nav-title">Ezequiel Torres</h1>
          <p className="nav-subtitle">Art Manager</p>
        </motion.button>

        {/* Navigation */}
        <div className="nav-actions">
          {/* Admin Menu */}
          {user?.role === 'ADMIN' && (
            <motion.button
              className={`nav-link${isActive('/users') ? ' active' : ''}`}
              onClick={() => navigate('/users')}
              whileTap={{ scale: 0.96 }}
              aria-label="Users"
            >
              <FiUsers size={18} />
              <span className="nav-link-label">Users</span>
            </motion.button>
          )}

          {/* User Info */}
          <motion.div
            className="nav-userinfo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="nav-user-name">{user?.name}</p>
            <p className="nav-user-role">{user?.role}</p>
          </motion.div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="btn btn-primary nav-logout"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Logout"
          >
            <FiLogOut size={16} />
            <span className="nav-logout-label">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
