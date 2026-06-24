import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to login. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <motion.div
        style={{ width: '100%', maxWidth: '400px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div style={{ textAlign: 'center', marginBottom: '32px' }} variants={itemVariants}>
          <motion.h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '8px',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Ezequiel Torres
          </motion.h1>
          <motion.p
            style={{
              color: '#999',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
            variants={itemVariants}
          >
            Art Manager
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '32px',
          }}
          variants={itemVariants}
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          {/* Error */}
          {error && (
            <motion.div
              style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '14px',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#ccc', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="input"
                placeholder="admin@example.com"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#ccc', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="input"
                placeholder="••••••••"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              />
            </motion.div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: '24px' }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              variants={itemVariants}
            >
              <motion.span
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {loading ? (
                  <>
                    <motion.div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #fff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </motion.span>
            </motion.button>
          </form>
        </motion.div>

        {/* Demo Info */}
        <motion.div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#666' }} variants={itemVariants}>
          <p>Demo credentials:</p>
          <p style={{ color: '#999', fontFamily: 'monospace', marginTop: '8px' }}>
            admin@example.com / admin123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
