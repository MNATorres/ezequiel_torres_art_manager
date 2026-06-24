import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiWifiOff } from 'react-icons/fi';

// Muestra un aviso fijo cuando el navegador pierde conexión. La app es un
// cliente de una API REST, así que sin internet no se pueden traer ni guardar
// datos: avisamos en vez de dejar fallar las peticiones en silencio.
export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          role="status"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: '#863bff',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
          }}
          initial={{ y: -48 }}
          animate={{ y: 0 }}
          exit={{ y: -48 }}
          transition={{ duration: 0.3 }}
        >
          <FiWifiOff size={16} />
          Sin conexión — algunos datos pueden no estar actualizados
        </motion.div>
      )}
    </AnimatePresence>
  );
};
