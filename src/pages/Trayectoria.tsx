import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiRefreshCw, FiEye } from 'react-icons/fi';
import { experienceService } from '../services/api';
import { getErrorMessage } from '../services/errors';
import type { Experience } from '../types';
import { Navbar } from '../components/Navbar';
import { ExperienceFormModal } from '../components/ExperienceFormModal';
import { PUBLIC_SITE_URL } from '../config';

export const Trayectoria = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await experienceService.getAll();
      setExperiences(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las experiencias'));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (experience: Experience) => {
    setEditing(experience);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    setDeletingId(id);
    try {
      await experienceService.remove(id);
      setExperiences((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar la experiencia'));
    } finally {
      setDeletingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -80, transition: { duration: 0.3 } },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
      <Navbar />

      <motion.main
        style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', padding: '32px 24px' }}
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
              Trayectoria
            </h1>
            <p style={{ color: '#999', fontSize: '16px' }}>
              Cargá las experiencias que se muestran en la página pública
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.a
              href={`${PUBLIC_SITE_URL}/trayectoria`}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver en el sitio"
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
                textDecoration: 'none',
              }}
              whileHover={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEye size={16} />
              Ver en el sitio
            </motion.a>

            <motion.button
              onClick={load}
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
              Nueva experiencia
            </motion.button>
          </div>
        </motion.div>

        {/* Error */}
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
        ) : experiences.length === 0 ? (
          /* Empty state */
          <motion.div
            style={{
              textAlign: 'center',
              padding: '56px 24px',
              color: '#999',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
            variants={itemVariants}
          >
            <p style={{ fontSize: '16px', marginBottom: '8px', color: '#ccc' }}>
              Todavía no hay experiencias
            </p>
            <p style={{ fontSize: '14px' }}>Tocá “Nueva experiencia” para cargar la primera.</p>
          </motion.div>
        ) : (
          /* List */
          <motion.div className="exp-list" variants={containerVariants}>
            <AnimatePresence mode="popLayout">
              {experiences.map((exp) => (
                <motion.div
                  key={exp._id}
                  className="exp-card"
                  variants={itemVariants}
                  exit="exit"
                  layout
                  whileHover={{ borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  {/* Thumbnail */}
                  {exp.imageUrl ? (
                    <img src={exp.imageUrl} alt={exp.title} className="exp-thumb" />
                  ) : (
                    <div className="exp-thumb-placeholder">
                      <FiImage size={28} />
                    </div>
                  )}

                  {/* Body */}
                  <div className="exp-body">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#fff',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {exp.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                          {new Date(exp.date).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <motion.button
                          onClick={() => openEdit(exp)}
                          className="icon-btn"
                          style={{
                            background: 'rgba(59, 130, 246, 0.12)',
                            color: '#60a5fa',
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                          }}
                          whileHover={{ background: 'rgba(59, 130, 246, 0.22)' }}
                          whileTap={{ scale: 0.92 }}
                          title="Editar"
                          aria-label="Editar experiencia"
                        >
                          <FiEdit2 size={16} />
                        </motion.button>

                        <motion.button
                          onClick={() => handleDelete(exp._id)}
                          disabled={deletingId === exp._id}
                          className="icon-btn"
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#f87171',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            opacity: deletingId === exp._id ? 0.5 : 1,
                          }}
                          whileHover={{ background: 'rgba(239, 68, 68, 0.22)' }}
                          whileTap={{ scale: 0.92 }}
                          title="Eliminar"
                          aria-label="Eliminar experiencia"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '14px',
                        color: '#bbb',
                        lineHeight: 1.6,
                        marginTop: '10px',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.main>

      <ExperienceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
        experience={editing}
      />
    </div>
  );
};
