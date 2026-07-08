import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../firebase';
import { authService } from '../services/api';
import { getErrorMessage } from '../services/errors';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authService.googleLogin(idToken);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      // Don't leave a Firebase session around for an account the backend rejected.
      await auth.signOut().catch(() => {});
      setError(getErrorMessage(err, 'No se pudo iniciar sesión. Intentá de nuevo.'));
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

          {/* Google sign-in */}
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: '#fff',
              color: '#1f1f1f',
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            variants={itemVariants}
          >
            <motion.span
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              animate={loading ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {loading ? (
                <>
                  <motion.div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #1f1f1f',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FcGoogle size={20} />
                  Iniciar sesión con Google
                </>
              )}
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
