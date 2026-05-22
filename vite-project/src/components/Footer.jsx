import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div className="footer-grid" style={styles.grid}>
          <div style={styles.brandCol}>
            <div style={styles.brand}>
              <img src="/LogoUniversidad.png" alt="Logo" style={styles.logoImg} />
              <div>
                <strong style={styles.brandTitle}>LimitsHub</strong>
                <p style={styles.brandTag}>Plataforma Educativa de Cálculo</p>
              </div>
            </div>
            <p style={styles.brandDesc}>
              Reduciendo la mortalidad académica en matemáticas universitarias mediante un ecosistema digital de aprendizaje interactivo.
            </p>
          </div>

          <div>
            <h4 style={styles.heading}>Contenido</h4>
            <ul style={styles.list}>
              <li><Link to="/saberes-previos" style={styles.link}>Saberes Previos</Link></li>
              <li><Link to="/calculo1/limites" style={styles.link}>Límites y Continuidad</Link></li>
              <li><Link to="/calculo1/derivadas" style={styles.link}>Derivadas</Link></li>
              <li><Link to="/calculo1/aplicaciones" style={styles.link}>Aplicaciones</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={styles.heading}>Plataforma</h4>
            <ul style={styles.list}>
              <li><Link to="/" style={styles.link}>Inicio</Link></li>
              <li><Link to="/calculo1" style={styles.link}>Cálculo I</Link></li>
              <li><span style={styles.link}>Asistente IA</span></li>
              <li><span style={styles.link}>Laboratorio</span></li>
            </ul>
          </div>

          <div>
            <h4 style={styles.heading}>Contacto</h4>
            <ul style={styles.list}>
              <li><span style={styles.link}>soporte@limitshub.edu</span></li>
              <li><span style={styles.link}>+57 (1) 234 5678</span></li>
              <li><span style={styles.link}>Bogotá, Colombia</span></li>
            </ul>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copy}>
            © {new Date().getFullYear()} LimitsHub — Proyecto de la Universidad Autónoma. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#0A1628',
    color: '#94A3B8',
    padding: '64px 0 32px',
    marginTop: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '48px',
    marginBottom: '48px',
  },
  brandCol: {
    maxWidth: '320px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  logoImg: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: "'Poppins', sans-serif",
  },
  brandTag: {
    color: '#94A3B8',
    fontSize: '13px',
    margin: 0,
  },
  brandDesc: {
    color: '#94A3B8',
    fontSize: '14px',
    lineHeight: 1.6,
    margin: 0,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    fontFamily: "'Poppins', sans-serif",
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    color: '#94A3B8',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '24px',
    textAlign: 'center',
  },
  copy: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    }
  `;
  document.head.appendChild(style);
}
