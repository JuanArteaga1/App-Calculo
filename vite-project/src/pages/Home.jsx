import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div className="container hero-container" style={styles.heroContainer}>
          <div style={styles.heroLeft}>
            <div style={styles.heroBadge}>
              <span style={styles.heroBadgeDot} />
              Plataforma Educativa Universitaria
            </div>
            <h1 className="hero-title" style={styles.heroTitle}>
              Aprende Cálculo de forma{' '}
              <span style={styles.heroAccent}>visual e interactiva</span>
            </h1>
            <p style={styles.heroDesc}>
              Reduce la ansiedad matemática y domina los conceptos de Cálculo I con visualizaciones dinámicas, 
              retroalimentación inmediata y un asistente IA disponible 24/7.
            </p>
            <div style={styles.heroActions}>
              <Link to="/calculo1" style={styles.btnPrimary}>
                Explorar cursos
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <Link to="/saberes-previos" style={styles.btnGhost}>
                Saberes previos
              </Link>
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroImageWrap}>
              <img
                src="/Estudiantes(2).jpg"
                alt="Estudiantes colaborando"
                style={styles.heroImage}
              />
              <div style={styles.heroImageOverlay} />
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section style={styles.metrics}>
        <div className="container">
          <div className="metrics-grid" style={styles.metricsGrid}>
            <MetricCard number="500+" label="Estudiantes activos" />
            <MetricCard number="95%" label="Tasa de aprobación" />
            <MetricCard number="24/7" label="Asistente IA disponible" />
            <MetricCard number="100%" label="Contenido gratuito" />
          </div>
        </div>
      </section>

      {/* PROPUESTA DE VALOR */}
      <section style={styles.sectionAlt}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Nuestra metodología</span>
            <h2 className="section-title" style={styles.sectionTitle}>Diseñado para reducir la mortalidad académica</h2>
            <p style={styles.sectionDesc}>
              No es solo una web con videos de matemáticas. Es un sistema integral que usa tecnología 
              para transformar cómo los estudiantes universitarios aprenden cálculo.
            </p>
          </div>

          <div className="features-grid" style={styles.featuresGrid}>
            <FeatureCard
              icon="🎯"
              title="Visualización interactiva"
              desc="Manipula gráficas en tiempo real para entender conceptos abstractos (límites, derivadas) de forma visual y concreta."
            />
            <FeatureCard
              icon="🤖"
              title="Asistente IA 24/7"
              desc="Chatbot que resuelve ejercicios paso a paso, responde dudas y proporciona retroalimentación inmediata."
            />
            <FeatureCard
              icon="📈"
              title="Aprendizaje personalizado"
              desc="Cada estudiante avanza a su propio ritmo, con contenido estructurado pero flexible."
            />
            <FeatureCard
              icon="🧘"
              title="Gestión emocional"
              desc="Interfaz limpia, mensajes positivos y pistas contextuales para reducir la ansiedad matemática."
            />
            <FeatureCard
              icon="📱"
              title="Accesibilidad ubicua"
              desc="Disponible en cualquier dispositivo, cualquier momento, sin barreras."
            />
            <FeatureCard
              icon="🏆"
              title="Evaluación formativa"
              desc="Retroalimentación continua para reforzar lo aprendido y corregir errores a tiempo."
            />
          </div>
        </div>
      </section>

      {/* CÁLCULO I DESTACADO */}
      <section style={styles.section}>
        <div className="container">
          <div className="course-highlight" style={styles.courseHighlight}>
            <div style={styles.courseHighlightLeft}>
              <span style={styles.badge}>Curso principal</span>
              <h2 style={styles.courseTitle}>Cálculo I</h2>
              <p style={styles.courseDesc}>
                Un viaje completo desde los fundamentos de los límites hasta las aplicaciones prácticas 
                de las derivadas en economía, física e ingeniería.
              </p>
              <ul style={styles.courseList}>
                <li style={styles.courseItem}>
                  <span style={styles.courseCheck}>✓</span>
                  Límites y Continuidad (9 temas)
                </li>
                <li style={styles.courseItem}>
                  <span style={styles.courseCheck}>✓</span>
                  Derivadas (10 temas)
                </li>
                <li style={styles.courseItem}>
                  <span style={styles.courseCheck}>✓</span>
                  Aplicaciones de la Derivada (12 temas)
                </li>
              </ul>
              <Link to="/calculo1" style={styles.btnSecondary}>
                Ver contenido del curso
              </Link>
            </div>
            <div style={styles.courseHighlightRight}>
              <img
                src="/Estudiantes(3).jpg"
                alt="Estudiantes aprendiendo"
                className="course-image"
                style={styles.courseImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={styles.ctaSection}>
        <div className="container" style={styles.ctaBox}>
          <img src="/logos%20autonoma_2.png" alt="Logo Universidad" style={styles.ctaLogo} />
          <h2 style={styles.ctaTitle}>¿Listo para dominar el Cálculo?</h2>
          <p style={styles.ctaDesc}>
            Únete a la comunidad de estudiantes que están transformando su relación con las matemáticas 
            universitarias. Sin costo, sin barreras.
          </p>
          <Link to="/calculo1" style={styles.btnPrimaryLarge}>
            Comenzar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ number, label }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricNumber}>{number}</div>
      <div style={styles.metricLabel}>{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{desc}</p>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #0047CC 0%, #003399 50%, #0A1628 100%)',
    color: '#fff',
    padding: '80px 0',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    gap: '64px',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.9)',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    width: 'fit-content',
    backdropFilter: 'blur(4px)',
  },
  heroBadgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10B981',
    display: 'inline-block',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: 800,
    lineHeight: 1.1,
    color: '#fff',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  heroAccent: {
    color: '#F4B400',
  },
  heroDesc: {
    fontSize: '18px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: '480px',
    margin: 0,
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: '#F4B400',
    color: '#1a1a1a',
    fontWeight: 700,
    fontSize: '16px',
    borderRadius: '12px',
    textDecoration: 'none',
    boxShadow: '0 8px 24px rgba(244,180,0,0.35)',
    transition: 'all 0.2s ease',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 28px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '16px',
    borderRadius: '12px',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
  },
  heroRight: {
    position: 'relative',
  },
  heroImageWrap: {
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '380px',
    objectFit: 'cover',
    display: 'block',
  },
  heroImageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,71,204,0.3), transparent 60%)',
  },

  metrics: {
    background: '#fff',
    padding: '48px 0',
    borderBottom: '1px solid #E2E8F0',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  metricCard: {
    textAlign: 'center',
    padding: '16px',
  },
  metricNumber: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#0047CC',
    fontFamily: "'Poppins', sans-serif",
  },
  metricLabel: {
    fontSize: '14px',
    color: '#64748B',
    marginTop: '4px',
  },

  sectionAlt: {
    background: '#F5F7FA',
    padding: '80px 0',
  },
  section: {
    padding: '80px 0',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '640px',
    margin: '0 auto 48px',
  },
  sectionTag: {
    display: 'inline-block',
    padding: '6px 14px',
    background: 'rgba(0,71,204,0.08)',
    color: '#0047CC',
    fontSize: '13px',
    fontWeight: 700,
    borderRadius: '999px',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#1E293B',
    margin: '0 0 12px',
    fontFamily: "'Poppins', sans-serif",
  },
  sectionDesc: {
    fontSize: '17px',
    color: '#64748B',
    margin: 0,
    lineHeight: 1.6,
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  featureCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  featureIcon: {
    fontSize: '32px',
    marginBottom: '14px',
  },
  featureTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#1E293B',
    margin: '0 0 8px',
    fontFamily: "'Poppins', sans-serif",
  },
  featureDesc: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: 1.55,
    margin: 0,
  },

  courseHighlight: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '56px',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '24px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  },
  courseHighlightLeft: {
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  badge: {
    display: 'inline-flex',
    padding: '6px 12px',
    background: 'rgba(244,180,0,0.12)',
    color: '#8a6d00',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: 'fit-content',
  },
  courseTitle: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#1E293B',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  courseDesc: {
    fontSize: '16px',
    color: '#64748B',
    lineHeight: 1.6,
    margin: 0,
  },
  courseList: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  courseItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    color: '#1E293B',
  },
  courseCheck: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'rgba(16,185,129,0.12)',
    color: '#059669',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#0047CC',
    color: '#fff',
    fontWeight: 700,
    fontSize: '15px',
    borderRadius: '10px',
    textDecoration: 'none',
    width: 'fit-content',
    boxShadow: '0 4px 12px rgba(0,71,204,0.25)',
  },
  courseHighlightRight: {
    height: '100%',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    minHeight: '360px',
    display: 'block',
  },

  ctaSection: {
    padding: '80px 0',
    background: '#F5F7FA',
  },
  ctaBox: {
    background: '#0A1628',
    borderRadius: '24px',
    padding: '64px 40px',
    textAlign: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaLogo: {
    height: '56px',
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
    opacity: 0.9,
  },
  ctaTitle: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  ctaDesc: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '560px',
    lineHeight: 1.6,
    margin: 0,
  },
  btnPrimaryLarge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: '#F4B400',
    color: '#1a1a1a',
    fontWeight: 800,
    fontSize: '16px',
    borderRadius: '12px',
    textDecoration: 'none',
    boxShadow: '0 8px 24px rgba(244,180,0,0.35)',
    marginTop: '8px',
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .hero-container { grid-template-columns: 1fr !important; }
      .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .course-highlight { grid-template-columns: 1fr !important; }
      .course-image { min-height: 220px !important; }
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 36px !important; }
      .metrics-grid { grid-template-columns: 1fr 1fr !important; }
      .features-grid { grid-template-columns: 1fr !important; }
      .section-title { font-size: 24px !important; }
    }
  `;
  document.head.appendChild(style);
}
