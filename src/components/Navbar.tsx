import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiUsers, FiHome, FiAward } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useAuth } from '../context/AuthContext';

interface NavLink {
  label: string;
  path: string;
  icon: IconType;
}

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const links: NavLink[] = [
    { label: 'Home', path: '/dashboard', icon: FiHome },
    { label: 'Trayectoria', path: '/trayectoria', icon: FiAward },
    // Users management is admin-only.
    ...(user?.role === 'ADMIN' ? [{ label: 'Users', path: '/users', icon: FiUsers }] : []),
  ];

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
          padding: '14px 24px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {links.map(({ label, path, icon: Icon }) => (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive(path) ? '#fff' : '#999',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  position: 'relative',
                }}
                whileHover={{ color: '#fff', background: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon size={17} />
                {label}
                {isActive(path) && (
                  <motion.div
                    layoutId="nav-underline"
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      left: 14,
                      right: 14,
                      height: '2px',
                      background: '#fff',
                      borderRadius: '1px',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

          {/* User info */}
          <motion.div
            style={{ fontSize: '13px', color: '#999', textAlign: 'right' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p style={{ margin: 0, fontWeight: 500, color: '#fff' }}>{user?.name}</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px' }}>{user?.role}</p>
          </motion.div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              marginLeft: '8px',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogOut size={16} />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
