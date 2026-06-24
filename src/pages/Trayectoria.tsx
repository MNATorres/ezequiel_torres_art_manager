import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';

interface Milestone {
  title: string;
  desc: string;
}

// Seeded from the public site's "Trayectoria" section. Editing + persistence
// to the backend can be wired up later.
const MILESTONES: Milestone[] = [
  {
    title: 'Fundador y Gestor - ANIMARTE',
    desc: 'Creación y gestión de ANIMARTE, un espacio dedicado al arte, dibujo y pintura. Impartición de talleres y cursos de body paint.',
  },
  {
    title: 'Organizador - Seminario Provincial de Body Paint Jujuy',
    desc: 'Organización y participación activa en el Seminario Provincial de Body Paint Jujuy, un evento anual que celebra la creatividad y la expresión artística a través del cuerpo humano.',
  },
  {
    title: 'Exposiciones de Arte',
    desc: 'Exhibición de obras de body paint en prestigiosos espacios y galerías de arte, incluyendo el Centro Cultural Héctor Tizón y el Museo de Bellas Artes de Jujuy.',
  },
  {
    title: 'Reconocimientos y Premios',
    desc: 'Ganador de varios concursos y premios de arte a nivel local, nacional e internacional. Reconocimiento por parte del gobernador de Jujuy y la Universidad Nacional de Jujuy.',
  },
  {
    title: 'Colaboración Mediática',
    desc: 'Colaboraciones con diversos medios de comunicación y cultura, incluyendo Jujuy FM 1017, Radio Nacional, El Tribuno de Jujuy y Notinor.',
  },
];

export const Trayectoria = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
      <Navbar />

      <motion.main
        style={{ maxWidth: '860px', marginLeft: 'auto', marginRight: 'auto', padding: '40px 24px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div style={{ marginBottom: '40px' }} variants={itemVariants}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
            Trayectoria
          </h1>
          <p style={{ color: '#999', fontSize: '16px' }}>
            Hitos de la carrera que se muestran en la página pública
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {MILESTONES.map((m) => (
            <motion.div
              key={m.title}
              variants={itemVariants}
              whileHover={{ x: 6, borderColor: 'rgba(255,255,255,0.2)' }}
              style={{
                borderLeft: '2px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0 12px 12px 0',
                padding: '20px 24px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {m.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#aaa', lineHeight: 1.7 }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          style={{ marginTop: '32px', fontSize: '13px', color: '#666', textAlign: 'center' }}
          variants={itemVariants}
        >
          La edición de estos hitos estará disponible próximamente.
        </motion.p>
      </motion.main>
    </div>
  );
};
