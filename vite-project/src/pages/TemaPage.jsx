import { useParams, Link } from 'react-router-dom';
import { getTemaById, getUnidadById } from '../data/temas';
import GraphZone from '../components/GraphZone';
import ErrorBoundary from '../components/ErrorBoundary';

export default function TemaPage() {
  const { unidadId, temaId } = useParams();
  const tema = getTemaById(unidadId, temaId);
  const unidad = getUnidadById(unidadId);

  if (!tema) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Tema no encontrado</h2>
        <Link to="/calculo1">Volver a Cálculo I</Link>
      </div>
    );
  }

  // Determinar modo y subtipo de graficacion segun tema
  function getGraphMode(uid, tid) {
    if (uid === 'limites') return { modo: 'limite', subtipo: '' };
    if (uid === 'derivadas') return { modo: 'derivada', subtipo: '' };
    if (uid === 'aplicaciones') {
      const map = {
        '3.2': 'crecimiento',
        '3.3': 'extremos',
        '3.4': 'concavidad',
        '3.5': 'extremos',
        '3.6': 'optimizacion',
        '3.7': 'tvm',
        '3.8': 'tvm',
        '3.9': 'lhopital',
        '3.10': 'aproximacion',
        '3.11': 'analisis',
        '3.12': 'default',
      };
      return { modo: 'aplicacion', subtipo: map[tid] || 'default' };
    }
    return { modo: 'limite', subtipo: '' };
  }

  const { modo, subtipo } = getGraphMode(unidadId, temaId);

  // Convertir contenido markdown-like a JSX simple
  const renderContent = (text) => {
    const lines = text.trim().split('\n');
    const elements = [];
    let listItems = [];
    let inList = false;

    const flushList = () => {
      if (inList && listItems.length) {
        elements.push(
          <ul key={`list-${elements.length}`} style={styles.list}>
            {listItems.map((item, i) => (
              <li key={i} style={styles.listItem}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={idx} style={styles.h2}>{trimmed.replace('## ', '')}</h2>);
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={idx} style={styles.h3}>{trimmed.replace('### ', '')}</h3>);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        listItems.push(trimmed.slice(2));
      } else if (trimmed.startsWith('[') && trimmed.includes(']=')) {
        // Ecuación simple centrada
        flushList();
        elements.push(
          <div key={idx} style={styles.equation}>
            <code style={styles.equationCode}>{trimmed.replace(/[\[\]]/g, '')}</code>
          </div>
        );
      } else {
        flushList();
        // Negritas con **
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        const children = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        elements.push(<p key={idx} style={styles.paragraph}>{children}</p>);
      }
    });

    flushList();
    return elements;
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link to="/calculo1" style={styles.breadcrumbLink}>Cálculo I</Link>
          <span style={styles.breadcrumbSep}>/</span>
          <Link to={`/calculo1/${unidadId}`} style={styles.breadcrumbLink}>
            {unidadId === 'limites' ? 'Límites' : unidadId === 'derivadas' ? 'Derivadas' : 'Aplicaciones'}
          </Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbCurrent}>{tema.titulo}</span>
        </div>

        <div className="tema-layout" style={styles.layout}>
          {/* Contenido principal */}
          <div style={styles.main}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTag}>Lección {tema.id}</span>
                <h1 style={styles.cardTitle}>{tema.titulo}</h1>
                <p style={styles.cardDesc}>{tema.descripcion}</p>
              </div>
              <div style={styles.cardBody}>
                {renderContent(tema.contenido)}
              </div>
            </div>

            {/* Zona gráfica dentro del flujo principal */}
            <div style={styles.graphWrap}>
              <ErrorBoundary>
                <GraphZone
                  modo={modo}
                  subtipo={subtipo}
                  title={`Laboratorio: ${tema.titulo}`}
                />
              </ErrorBoundary>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="tema-sidebar" style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <h4 style={styles.sidebarTitle}>Tu progreso</h4>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: '0%' }} />
              </div>
              <p style={styles.progressText}>Comienza la lección para registrar tu avance.</p>
            </div>

            <div style={styles.sidebarCard}>
              <h4 style={styles.sidebarTitle}>Recursos</h4>
              <ul style={styles.sidebarList}>
                <li style={styles.sidebarItem}>📄 Teoría completa</li>
                <li style={styles.sidebarItem}>📝 Ejercicios de práctica</li>
                <li style={styles.sidebarItem}>🎥 Video explicativo</li>
                <li style={styles.sidebarItem}>🔬 Laboratorio interactivo</li>
              </ul>
            </div>

            <div style={styles.sidebarCard}>
              <h4 style={styles.sidebarTitle}>Consejo del día</h4>
              <p style={styles.tip}>
                "No busques la perfección en el primer intento. El cálculo se entiende practicando, 
                no memorizando."
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '32px 0 80px',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '32px',
    alignItems: 'start',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '28px 32px',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  cardTag: {
    display: 'inline-flex',
    padding: '4px 10px',
    background: 'rgba(0,71,204,0.08)',
    color: '#0047CC',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#1E293B',
    margin: '0 0 8px',
    fontFamily: "'Poppins', sans-serif",
  },
  cardDesc: {
    fontSize: '15px',
    color: '#64748B',
    margin: 0,
    lineHeight: 1.5,
  },
  cardBody: {
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  h2: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1E293B',
    margin: '16px 0 6px',
    fontFamily: "'Poppins', sans-serif",
  },
  h3: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1E293B',
    margin: '12px 0 4px',
    fontFamily: "'Poppins', sans-serif",
  },
  paragraph: {
    fontSize: '15px',
    color: '#334155',
    lineHeight: 1.7,
    margin: 0,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '4px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    position: 'relative',
    paddingLeft: '20px',
    fontSize: '15px',
    color: '#334155',
    lineHeight: 1.6,
  },
  equation: {
    background: '#0F172A',
    borderRadius: '12px',
    padding: '16px 20px',
    margin: '8px 0',
    textAlign: 'center',
  },
  equationCode: {
    color: '#E2E8F0',
    fontFamily: "'Courier New', monospace",
    fontSize: '16px',
    letterSpacing: '0.5px',
  },
  graphWrap: {
    marginTop: '8px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'sticky',
    top: '90px',
  },
  sidebarCard: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1E293B',
    margin: '0 0 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: "'Poppins', sans-serif",
  },
  progressBar: {
    height: '8px',
    background: '#E2E8F0',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  progressFill: {
    height: '100%',
    background: '#0047CC',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sidebarItem: {
    fontSize: '14px',
    color: '#334155',
    padding: '8px 10px',
    background: '#F8FAFC',
    borderRadius: '8px',
  },
  tip: {
    fontSize: '14px',
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 1.55,
    margin: 0,
    padding: '10px',
    background: '#FEF3C7',
    borderRadius: '8px',
    borderLeft: '3px solid #F4B400',
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .tema-layout { grid-template-columns: 1fr !important; }
      .tema-sidebar { position: static !important; }
    }
  `;
  document.head.appendChild(style);
}
