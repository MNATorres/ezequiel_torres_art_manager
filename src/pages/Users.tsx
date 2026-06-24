import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiEdit2, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import type { User } from '../types';
import { Navbar } from '../components/Navbar';

export const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Solo admin puede acceder
  if (user?.role !== 'ADMIN') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '20px',
        }}
      >
        Acceso Denegado
      </div>
    );
  }

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

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
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
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
      <Navbar />

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
        {/* Header */}
        <motion.div style={{ marginBottom: '32px' }} variants={itemVariants}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
            Usuarios
          </h1>
          <p style={{ color: '#999', fontSize: '16px' }}>
            Gestiona los usuarios del sistema
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '48px',
            }}
            variants={itemVariants}
          >
            <motion.div
              style={{
                width: '32px',
                height: '32px',
                borderTop: '3px solid #fff',
                borderRight: '3px solid transparent',
                borderRadius: '50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        ) : (
          /* Table */
          <motion.div
            style={{
              overflowX: 'auto',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
            }}
            variants={itemVariants}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: '#fff',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    Usuario
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    Rol
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    Registrado
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {users.map((u) => (
                    <motion.tr
                      key={u._id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #333, #555)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                            }}
                          >
                            <FiUser size={20} />
                          </div>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            padding: '6px 12px',
                            background: u.role === 'ADMIN' ? '#333' : '#1a1a1a',
                            color: u.role === 'ADMIN' ? '#fff' : '#999',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#999', fontSize: '14px' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <motion.button
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                            }}
                            whileHover={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              borderColor: 'rgba(59, 130, 246, 0.5)',
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiEdit2 size={14} />
                            Editar
                          </motion.button>

                          <motion.button
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                            }}
                            whileHover={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              borderColor: 'rgba(239, 68, 68, 0.5)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(u._id)}
                          >
                            <FiTrash2 size={14} />
                            Eliminar
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <motion.div
            style={{
              textAlign: 'center',
              paddingTop: '48px',
              color: '#999',
              fontSize: '16px',
            }}
            variants={itemVariants}
          >
            No hay usuarios registrados
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};
