import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import { artworkService, uploadService } from '../services/api';
import { getErrorMessage } from '../services/errors';
import type { Artwork } from '../types';

interface ArtworkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  artwork?: Artwork | null;
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

export const ArtworkFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  artwork,
}: ArtworkFormModalProps) => {
  const isEditMode = Boolean(artwork);

  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('0');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the form each time the modal opens (create vs edit).
  useEffect(() => {
    if (isOpen) {
      setTitle(artwork?.title ?? '');
      setOrder(artwork?.order != null ? String(artwork.order) : '0');
      setDescription(artwork?.description ?? '');
      setImageUrl(artwork?.imageUrl);
      setImageFile(null);
      setPreview(artwork?.imageUrl ?? null);
      setError('');
    }
  }, [isOpen, artwork]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    setImageUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If the admin picked a new file, upload it first to get its URL.
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const res = await uploadService.uploadImage(imageFile);
        finalImageUrl = res.data.url;
      }

      const payload = {
        title,
        description,
        order: Number(order) || 0,
        ...(finalImageUrl ? { imageUrl: finalImageUrl } : {}),
      };

      if (isEditMode && artwork) {
        await artworkService.update(artwork._id, payload);
      } else {
        await artworkService.create(payload);
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
            overflowY: 'auto',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'linear-gradient(135deg, #141414 0%, #1f1f1f 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              margin: 'auto',
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
                {isEditMode ? 'Editar obra' : 'Nueva obra'}
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

            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              {/* Title */}
              <div>
                <label style={labelStyle}>Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  required
                  className="input"
                  style={darkInputStyle}
                  placeholder="Ej. Murales Humanos"
                />
              </div>

              {/* Order */}
              <div>
                <label style={labelStyle}>
                  Orden{' '}
                  <span style={{ color: '#666', fontWeight: 400 }}>
                    (menor aparece primero en el sitio)
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  disabled={loading}
                  required
                  className="input"
                  style={darkInputStyle}
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  required
                  rows={4}
                  className="input"
                  style={{ ...darkInputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Contá brevemente de qué se trata esta obra"
                />
              </div>

              {/* Image (optional) */}
              <div>
                <label style={labelStyle}>
                  Imagen <span style={{ color: '#666', fontWeight: 400 }}>(opcional)</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                />

                {preview ? (
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <img
                      src={preview}
                      alt="Vista previa"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={clearImage}
                      disabled={loading}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fca5a5',
                        fontSize: '12px',
                      }}
                      whileHover={{ background: 'rgba(0,0,0,0.85)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 size={14} />
                      Quitar
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '28px 16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      color: '#999',
                    }}
                    whileHover={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <FiUploadCloud size={26} />
                    <span style={{ fontSize: '13px' }}>Subir imagen</span>
                  </motion.button>
                )}
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
