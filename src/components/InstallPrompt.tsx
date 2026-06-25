import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiDownload, FiShare, FiX } from 'react-icons/fi';

// The browser's install event (not in the standard TS lib types).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * Suggests installing the app as a PWA. On Chromium (Android/desktop) it shows
 * an "Instalar" button wired to the native prompt; on iOS Safari (no such
 * event) it shows the manual "Compartir → Agregar a inicio" hint. Hidden when
 * already installed or previously dismissed.
 */
export const InstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      localStorage.setItem(DISMISS_KEY, '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // iOS Safari never fires beforeinstallprompt → show the manual hint.
    if (isIos()) {
      setIosHint(true);
      setShow(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setShow(false);
    localStorage.setItem(DISMISS_KEY, '1');
    setDeferred(null);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Instalar la aplicación"
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            zIndex: 100,
            width: 'calc(100% - 32px)',
            maxWidth: '420px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            background: 'rgba(20, 20, 20, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
            color: '#fff',
          }}
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div
            style={{
              flexShrink: 0,
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #000, #333)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FiDownload size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Instalá la app</p>
            {iosHint ? (
              <p style={{ fontSize: '12px', color: '#aaa', margin: '2px 0 0 0' }}>
                Tocá <FiShare size={11} style={{ verticalAlign: 'middle' }} /> Compartir y luego
                “Agregar a inicio”.
              </p>
            ) : (
              <p style={{ fontSize: '12px', color: '#aaa', margin: '2px 0 0 0' }}>
                Accedé más rápido desde tu celular.
              </p>
            )}
          </div>

          {!iosHint && (
            <motion.button
              onClick={install}
              style={{
                flexShrink: 0,
                padding: '9px 16px',
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Instalar
            </motion.button>
          )}

          <motion.button
            onClick={dismiss}
            aria-label="Descartar"
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              color: '#888',
              display: 'flex',
              padding: '4px',
            }}
            whileHover={{ color: '#fff' }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={18} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
