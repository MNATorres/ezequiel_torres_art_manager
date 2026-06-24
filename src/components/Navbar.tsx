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
      style={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            Ezequiel Torres
          </h1>
          <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0 0' }}>Art Manager</p>
        </motion.button>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Admin Menu */}
          {user?.role === 'ADMIN' && (
            <motion.button
              onClick={() => navigate('/users')}
              style={{
                background: isActive('/users') ? 'rgba(255, 255, 255, 0.05)' : 'none',
                border: 'none',
                color: isActive('/users') ? '#fff' : '#999',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
              }}
              whileHover={{ color: '#fff', background: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.96 }}
            >
              <FiUsers size={18} />
              Users
            </motion.button>
          )}

          {/* User Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div
              style={{ fontSize: '13px', color: '#999', textAlign: 'right' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p style={{ margin: 0, fontWeight: 500, color: '#fff' }}>{user?.name}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px' }}>{user?.role}</p>
            </motion.div>

            <motion.button
              onClick={handleLogout}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut size={16} />
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
