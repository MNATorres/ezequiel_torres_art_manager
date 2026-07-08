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
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="lf-root">
      {/* Animated ambient background */}
      <div className="lf-orb lf-orb-1" />
      <div className="lf-orb lf-orb-2" />
      <div className="lf-grid" />

      <motion.div
        className="lf-card-wrap"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="lf-card-glow" />

        <div className="lf-card">
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <motion.div
              className="lf-mono"
              variants={itemVariants}
              whileHover={{ scale: 1.06, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              ET
            </motion.div>

            <motion.h1 className="lf-title" style={{ marginTop: '20px' }} variants={itemVariants}>
              Ezequiel Torres
            </motion.h1>
            <motion.p className="lf-sub" variants={itemVariants}>
              Art Manager
            </motion.p>
          </div>

          <motion.div className="lf-divider" variants={itemVariants} />

          {/* Error */}
          {error && (
            <motion.div
              style={{
                marginBottom: '20px',
                padding: '14px 16px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '13px',
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Google sign-in */}
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="lf-gbtn"
            variants={itemVariants}
            whileHover={loading ? {} : { scale: 1.015 }}
            whileTap={loading ? {} : { scale: 0.985 }}
          >
            {loading ? (
              <>
                <motion.span
                  className="lf-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Verificando acceso...
              </>
            ) : (
              <>
                <FcGoogle size={20} />
                Iniciar sesión con Google
              </>
            )}
          </motion.button>

          {/* Footer */}
          <motion.div className="lf-foot" variants={itemVariants}>
            <span className="lf-dot" />
            Acceso restringido · solo cuentas autorizadas
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
