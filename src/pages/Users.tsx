import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiEdit2, FiUser, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { userService } from '../services/api';
import { getErrorMessage } from '../services/errors';
import type { User } from '../types';
import { Navbar } from '../components/Navbar';
import { UserFormModal } from '../components/UserFormModal';

const thStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '14px',
  color: '#ccc',
};

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal state: closed | create | edit(user)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los usuarios'));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    setDeletingId(id);
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el usuario'));
    } finally {
      setDeletingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
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
        style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', padding: '32px 24px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          style={{
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
          variants={itemVariants}
        >
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
              Usuarios
            </h1>
            <p style={{ color: '#999', fontSize: '16px' }}>Gestiona los usuarios del sistema</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              onClick={loadUsers}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ccc',
                fontWeight: 600,
                fontSize: '14px',
              }}
              whileHover={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
              whileTap={{ scale: 0.97 }}
            >
              <FiRefreshCw size={16} />
              Refrescar
            </motion.button>

            <motion.button
              onClick={openCreate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 600,
                fontSize: '14px',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiPlus size={18} />
              Nuevo usuario
            </motion.button>
          </div>
        </motion.div>

        {/* Error banner */}
        {error && (
          <motion.div
            style={{
              marginBottom: '20px',
              padding: '14px 18px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '14px',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {loading ? (
          <motion.div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '48px' }}
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
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <th style={thStyle}>Usuario</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rol</th>
                  <th style={thStyle}>Registrado</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
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
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
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
                      <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>{u.email}</td>
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
                            onClick={() => openEdit(u)}
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                            }}
                            whileHover={{ background: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiEdit2 size={14} />
                            Editar
                          </motion.button>

                          <motion.button
                            onClick={() => handleDelete(u._id)}
                            disabled={deletingId === u._id}
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              opacity: deletingId === u._id ? 0.5 : 1,
                            }}
                            whileHover={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiTrash2 size={14} />
                            {deletingId === u._id ? 'Eliminando...' : 'Eliminar'}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Empty state inside the table container */}
            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#999', fontSize: '15px' }}>
                No hay usuarios registrados
              </div>
            )}
          </motion.div>
        )}
      </motion.main>

      {/* Create / Edit modal */}
      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadUsers}
        user={editingUser}
      />
    </div>
  );
};
