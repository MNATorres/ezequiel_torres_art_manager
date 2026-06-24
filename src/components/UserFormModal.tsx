import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { userService } from '../services/api';
import { getErrorMessage } from '../services/errors';
import type { Role, User } from '../types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided, the modal edits this user; otherwise it creates a new one. */
  user?: User | null;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#ccc',
  marginBottom: '8px',
};

const darkInputStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
};

export const UserFormModal = ({ isOpen, onClose, onSuccess, user }: UserFormModalProps) => {
  const isEditMode = Boolean(user);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(user?.role ?? 'USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-sync the form every time the modal opens (create vs edit, or a different user).
  useEffect(() => {
    if (isOpen) {
      setName(user?.name ?? '');
      setEmail(user?.email ?? '');
      setPassword('');
      setRole(user?.role ?? 'USER');
      setError('');
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode && user) {
        // Only send password if the admin typed a new one.
        await userService.updateUser(user._id, {
          name,
          email,
          role,
          ...(password ? { password } : {}),
        });
      } else {
        await userService.createUser({ name, email, password, role });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'linear-gradient(135deg, #141414 0%, #1f1f1f 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                {isEditMode ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
              <motion.button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  display: 'flex',
                  padding: '4px',
                }}
                whileHover={{ color: '#fff', scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar"
              >
                <FiX size={22} />
              </motion.button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                style={{
                  marginBottom: '20px',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '13px',
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  className="input"
                  style={darkInputStyle}
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="input"
                  style={darkInputStyle}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Password
                  {isEditMode && (
                    <span style={{ color: '#666', fontWeight: 400 }}> (dejar vacío para no cambiar)</span>
                  )}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required={!isEditMode}
                  minLength={6}
                  className="input"
                  style={darkInputStyle}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label style={labelStyle}>Rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  disabled={loading}
                  className="input"
                  style={{ ...darkInputStyle, cursor: 'pointer' }}
                >
                  <option value="USER" style={{ background: '#1f1f1f' }}>
                    USER
                  </option>
                  <option value="ADMIN" style={{ background: '#1f1f1f' }}>
                    ADMIN
                  </option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ccc',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                  whileHover={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: loading ? 0.6 : 1,
                  }}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #000',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  ) : isEditMode ? (
                    'Guardar'
                  ) : (
                    'Crear'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
