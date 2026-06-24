import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiTrash2, FiEdit2, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import type { User } from '../types';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #fff 100%)' }}>
      {/* Header */}
      <motion.header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          style={{
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000' }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#666' }}>Welcome, {user?.name}</p>
          </motion.div>

          <motion.button
            onClick={handleLogout}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        style={{
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '32px 24px',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title Section */}
        <motion.div style={{ marginBottom: '32px' }} variants={itemVariants}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
            Users
          </h2>
          <p style={{ color: '#666' }}>Manage all users and their permissions</p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '48px' }}
            variants={itemVariants}
          >
            <motion.div
              style={{
                width: '32px',
                height: '32px',
                borderTop: '3px solid #000',
                borderRight: '3px solid transparent',
                borderRadius: '50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        ) : (
          /* Users Grid */
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {users.map((u) => (
                <motion.div
                  key={u._id}
                  className="card"
                  style={{
                    padding: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  variants={itemVariants}
                  whileHover={{ y: -16, boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}
                  exit="exit"
                  layout
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {/* User Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <motion.div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FiUser size={24} />
                    </motion.div>

                    <motion.div
                      style={{
                        padding: '6px 12px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '4px',
                      }}
                      animate={{
                        backgroundColor: u.role === 'ADMIN' ? '#000' : '#666',
                      }}
                    >
                      {u.role}
                    </motion.div>
                  </div>

                  {/* User Info */}
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>
                      {u.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.email}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
                    Created {new Date(u.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0';
                    }}
                  >
                    <motion.button
                      className="btn"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: '#f0f0f0',
                        color: '#000',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: 'none',
                      }}
                      whileHover={{ scale: 1.02, background: '#e0e0e0' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </motion.button>

                    <motion.button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(u._id)}
                    >
                      <FiTrash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <motion.div style={{ textAlign: 'center', paddingTop: '48px' }} variants={itemVariants}>
            <p style={{ color: '#666' }}>No users found</p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};
