import { Link, useParams } from 'react-router-dom';
import { unidades } from '../data/temas';
import ChatSection from '../components/ChatSection';
import HeroAnimation from '../components/HeroAnimation';
import AnimatedIcon from '../components/AnimatedIcon';

export default function Calculo1() {
  const { unidadId } = useParams();

  // Si hay unidadId, mostrar temas de esa unidad
  if (unidadId) {
    const unidad = unidades.find(u => u.id === unidadId);
    if (!unidad) {
      return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2>Unidad no encontrada</h2>
          <Link to="/calculo1">Volver al Cálculo I</Link>
        </div>
      );
    }

    return (
      <div style={styles.page}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <Link to="/calculo1" style={styles.breadcrumbLink}>Cálculo I</Link>
            <span style={styles.breadcrumbSep}>/</span>
            <span style={styles.breadcrumbCurrent}>{unidad.titulo}</span>
          </div>

          <div style={styles.unidadHeader}>
            <AnimatedIcon type={unidad.id} size={64} />
            <div>
              <h1 style={styles.unidadTitle}>{unidad.titulo}</h1>
              <p style={styles.unidadDesc}>{unidad.descripcion}</p>
            </div>
          </div>

          <div className="calculo-temas-grid" style={styles.temasGrid}>
            {unidad.temas.map((tema, idx) => (
              <Link
                key={tema.id}
                to={`/calculo1/${unidad.id}/${tema.id}`}
                style={styles.temaCard}
              >
                <div style={styles.temaNumber}>{String(idx + 1).padStart(2, '0')}</div>
                <h3 style={styles.temaTitle}>{tema.titulo}</h3>
                <p style={styles.temaDesc}>{tema.descripcion}</p>
                <div style={styles.temaMeta}>
                  <span style={styles.temaTag}>Lección</span>
                  <span style={styles.temaArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Chatbot especializado al final de la unidad */}
          <ChatSection tema={unidadId} unidadTitulo={unidad.titulo} />
        </div>
      </div>
    );
  }

  // Vista general de Cálculo I
  return (
    <div>
      <section style={styles.hero}>
        <div className="container calculo-hero-container" style={styles.heroContainer}>
          <div style={styles.heroLeft}>
            <span style={styles.heroTag}>Curso principal</span>
            <h1 style={styles.heroTitle}>Cálculo I</h1>
            <p style={styles.heroDesc}>
              Un viaje completo desde los fundamentos de los límites hasta las aplicaciones prácticas 
              de las derivadas. Aprende con el curso y refuerza a tu ritmo con contenido interactivo y visualizaciones dinámicas.
            </p>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNum}>3</span>
                <span style={styles.statLabel}>Unidades</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>31</span>
                <span style={styles.statLabel}>Temas</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>∞</span>
                <span style={styles.statLabel}>Práctica</span>
              </div>
            </div>
          </div>
          <div style={styles.heroRight}>
            <HeroAnimation />
          </div>
        </div>
      </section>

      <section style={styles.unitsSection}>
        <div className="container">
          <div style={styles.unitsHeader}>
            <h2 style={styles.unitsTitle}>Estructura del curso</h2>
            <p style={styles.unitsDesc}>
              El curso está dividido en tres unidades que cubren todo el programa de Cálculo I 
              de forma progresiva y conectada.
            </p>
          </div>

          <div className="calculo-units-grid" style={styles.unitsGrid}>
            {unidades.map((u) => (
              <Link key={u.id} to={`/calculo1/${u.id}`} style={styles.unitCard}>
                <AnimatedIcon type={u.id} size={52} />
                <h3 style={styles.unitTitle}>{u.titulo}</h3>
                <p style={styles.unitDesc}>{u.descripcion}</p>
                <div style={styles.unitFooter}>
                  <span style={styles.unitCount}>{u.temas.length} temas</span>
                  <span style={{ ...styles.unitBtn, color: u.color }}>Explorar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    padding: '40px 0 80px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  breadcrumbLink: {
    color: '#0047CC',
    textDecoration: 'none',
    fontWeight: 600,
  },
  breadcrumbSep: {
    color: '#94A3B8',
  },
  breadcrumbCurrent: {
    color: '#1E293B',
    fontWeight: 700,
  },
  unidadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
    padding: '24px',
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  unidadIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    flexShrink: 0,
  },
  unidadTitle: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#1E293B',
    margin: '0 0 6px',
    fontFamily: "'Poppins', sans-serif",
  },
  unidadDesc: {
    fontSize: '15px',
    color: '#64748B',
    margin: 0,
    maxWidth: '640px',
  },
  temasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  temaCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  temaNumber: {
    fontSize: '12px',
    fontWeight: 800,
    color: '#0047CC',
    letterSpacing: '1px',
  },
  temaTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#1E293B',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  temaDesc: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: 1.5,
    margin: 0,
    flex: 1,
  },
  temaMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6px',
  },
  temaTag: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#64748B',
    background: '#F1F5F9',
    padding: '4px 10px',
    borderRadius: '999px',
  },
  temaArrow: {
    color: '#0047CC',
    fontWeight: 700,
    fontSize: '16px',
  },

  hero: {
    background: 'linear-gradient(135deg, #0047CC 0%, #003399 50%, #0A1628 100%)',
    color: '#fff',
    padding: '64px 0',
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    gap: '56px',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  heroTag: {
    display: 'inline-flex',
    padding: '6px 14px',
    background: 'rgba(244,180,0,0.15)',
    color: '#F4B400',
    fontSize: '12px',
    fontWeight: 700,
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: 'fit-content',
  },
  heroTitle: {
    fontSize: '40px',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  heroDesc: {
    fontSize: '17px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.85)',
    margin: 0,
    maxWidth: '520px',
  },
  heroStats: {
    display: 'flex',
    gap: '24px',
    marginTop: '8px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statNum: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#F4B400',
    fontFamily: "'Poppins', sans-serif",
  },
  statLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
  },
  heroRight: {
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  },
  heroImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    display: 'block',
  },

  unitsSection: {
    padding: '64px 0',
    background: '#F5F7FA',
  },
  unitsHeader: {
    textAlign: 'center',
    maxWidth: '640px',
    margin: '0 auto 40px',
  },
  unitsTitle: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#1E293B',
    margin: '0 0 10px',
    fontFamily: "'Poppins', sans-serif",
  },
  unitsDesc: {
    fontSize: '16px',
    color: '#64748B',
    margin: 0,
    lineHeight: 1.55,
  },
  unitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  unitCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  unitIconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    fontSize: '24px',
  },
  unitIcon: {
    lineHeight: 1,
  },
  unitTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1E293B',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  unitDesc: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: 1.55,
    margin: '0 0 6px',
    flex: 1,
  },
  unitFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #E2E8F0',
    paddingTop: '14px',
  },
  unitCount: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  unitBtn: {
    fontSize: '13px',
    fontWeight: 700,
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .calculo-hero-container { grid-template-columns: 1fr !important; }
      .calculo-units-grid { grid-template-columns: 1fr !important; }
      .calculo-temas-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(style);
}
