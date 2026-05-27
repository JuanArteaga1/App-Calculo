import { Link } from 'react-router-dom';

const saberesPorUnidad = {
  limites: [
    { id: 'sp-3', titulo: 'Funciones y Gráficas', icono: '📈' },
    { id: 'sp-1', titulo: 'Aritmética y Álgebra Básica', icono: '➕' },
    { id: 'sp-2', titulo: 'Ecuaciones e Inecuaciones', icono: '⚖️' },
  ],
  derivadas: [
    { id: 'sp-3', titulo: 'Funciones y Gráficas', icono: '📈' },
    { id: 'sp-2', titulo: 'Ecuaciones e Inecuaciones', icono: '⚖️' },
    { id: 'sp-5', titulo: 'Geometría Analítica', icono: '📐' },
  ],
  aplicaciones: [
    { id: 'sp-3', titulo: 'Funciones y Gráficas', icono: '📈' },
    { id: 'sp-2', titulo: 'Ecuaciones e Inecuaciones', icono: '⚖️' },
    { id: 'sp-5', titulo: 'Geometría Analítica', icono: '📐' },
    { id: 'sp-1', titulo: 'Aritmética y Álgebra Básica', icono: '➕' },
  ],
};

export default function SaberesRelacionados({ unidadId }) {
  const saberes = saberesPorUnidad[unidadId] || saberesPorUnidad.limites;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.emoji}>💡</span>
        <span style={styles.title}>¿No te acuerdas?</span>
      </div>
      <p style={styles.text}>
        Antes de continuar, repasa estos conceptos previos que necesitarás para entender este tema.
      </p>
      <div style={styles.chips}>
        {saberes.map((s) => (
          <div key={s.id} style={styles.chip}>
            <span style={styles.chipIcon}>{s.icono}</span>
            <span style={styles.chipLabel}>{s.titulo}</span>
          </div>
        ))}
      </div>
      <Link to="/saberes-previos" style={styles.link}>
        Repasar saberes previos →
      </Link>
    </div>
  );
}

const styles = {
  container: {
    background: '#FEFCE8',
    borderRadius: '16px',
    border: '1px solid #FDE047',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  emoji: {
    fontSize: '24px',
    lineHeight: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#854D0E',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  text: {
    fontSize: '14px',
    color: '#713F12',
    lineHeight: 1.55,
    margin: 0,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#FEF9C3',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#854D0E',
  },
  chipIcon: {
    fontSize: '14px',
    lineHeight: 1,
  },
  chipLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#854D0E',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 18px',
    background: '#FACC15',
    color: '#422006',
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: '10px',
    textDecoration: 'none',
    width: 'fit-content',
    boxShadow: '0 4px 12px rgba(250,204,21,0.35)',
    transition: 'all 0.2s ease',
    marginTop: '4px',
  },
};