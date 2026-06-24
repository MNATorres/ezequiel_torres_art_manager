import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user } = useAuth();

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      <motion.div
        style={{
          maxWidth: '800px',
          textAlign: 'center',
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Title */}
        <motion.div variants={itemVariants}>
          <motion.h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '16px',
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Ezequiel Torres Art
          </motion.h1>
          <motion.p
            style={{
              fontSize: '18px',
              color: '#999',
              marginTop: '8px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
            variants={itemVariants}
          >
            Gallery Manager System
          </motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #fff, transparent)',
            margin: '40px auto',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Welcome Message */}
        <motion.div
          style={{
            marginBottom: '48px',
          }}
          variants={itemVariants}
        >
          <p
            style={{
              fontSize: '18px',
              color: '#fff',
              marginBottom: '16px',
              lineHeight: '1.8',
            }}
          >
            Bienvenido, <span style={{ fontWeight: 600 }}>{user?.name}</span>
          </p>
          <p
            style={{
              fontSize: '16px',
              color: '#ccc',
              lineHeight: '1.8',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Este es tu panel de control para gestionar la galería de arte de Ezequiel Torres.
            Desde aquí podrás administrar toda la información que se visualiza en la página
            principal, incluyendo obras, galerías, y más.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
          variants={containerVariants}
        >
          {/* Feature 1 */}
          <motion.div
            style={{
              padding: '32px 24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
            variants={itemVariants}
            whileHover={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <motion.div
              style={{
                fontSize: '40px',
                marginBottom: '16px',
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎨
            </motion.div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Gestiona Obras
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#999',
              }}
            >
              Administra tu colección de arte
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            style={{
              padding: '32px 24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
            variants={itemVariants}
            whileHover={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <motion.div
              style={{
                fontSize: '40px',
                marginBottom: '16px',
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            >
              📸
            </motion.div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Galería Visual
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#999',
              }}
            >
              Organiza tus imágenes
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            style={{
              padding: '32px 24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
            variants={itemVariants}
            whileHover={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <motion.div
              style={{
                fontSize: '40px',
                marginBottom: '16px',
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              👥
            </motion.div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              Usuarios
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#999',
              }}
            >
              Administra accesos
            </p>
          </motion.div>
        </motion.div>

        {/* Admin Notice */}
        {user?.role === 'ADMIN' && (
          <motion.div
            style={{
              padding: '24px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              color: '#93c5fd',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p style={{ margin: 0, fontWeight: 600, marginBottom: '8px' }}>
              👑 Modo Administrador Activo
            </p>
            <p style={{ margin: 0 }}>
              Tienes acceso a la gestión de usuarios. Navega a la sección de usuarios desde
              el menú para administrar accesos.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
