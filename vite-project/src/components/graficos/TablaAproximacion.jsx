export default function TablaAproximacion({ datos, modo = 'limite' }) {
  if (!datos || datos.length === 0) return null;

  const esLimite = modo === 'limite';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.icon}>📊</span>
        <span style={styles.title}>
          {esLimite ? 'Aproximación por ambos lados' : 'Valores de aproximación'}
        </span>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.thFirst }}>h</th>
              <th style={styles.th}>← Izquierda {esLimite ? 'f(a - h)' : 'f(x₀ - h)'}</th>
              <th style={styles.th}>Derecha → {esLimite ? 'f(a + h)' : 'f(x₀ + h)'}</th>
              <th style={{ ...styles.th, ...styles.thLast }}>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, idx) => {
              const diff =
                fila.izq !== null && fila.der !== null
                  ? Math.abs(fila.der - fila.izq)
                  : null;
              const isLast = idx === datos.length - 1;
              return (
                <tr
                  key={idx}
                  style={isLast ? styles.rowHighlight : styles.row}
                >
                  <td style={styles.td}>{fila.h}</td>
                  <td style={styles.td}>
                    {fila.izq !== null ? (
                      <span style={styles.valor}>
                        {typeof fila.izq === 'number' ? fila.izq.toFixed(6) : fila.izq}
                      </span>
                    ) : (
                      <span style={styles.na}>—</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {fila.der !== null ? (
                      <span style={styles.valor}>
                        {typeof fila.der === 'number' ? fila.der.toFixed(6) : fila.der}
                      </span>
                    ) : (
                      <span style={styles.na}>—</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {diff !== null ? (
                      <span style={{ ...styles.diff, ...(diff < 0.001 ? styles.diffConverge : {}) }}>
                        {diff.toExponential(2)}
                      </span>
                    ) : (
                      <span style={styles.na}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={styles.footer}>
        {esLimite
          ? 'Cuando h → 0, los valores de izquierda y derecha convergen al límite.'
          : 'Los valores se acercan a la derivada cuando h disminuye.'}
      </p>
    </div>
  );
}

const styles = {
  container: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  icon: {
    fontSize: '16px',
  },
  title: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1E293B',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableWrap: {
    overflowX: 'auto',
    padding: '0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },
  th: {
    padding: '10px 12px',
    textAlign: 'center',
    fontWeight: 700,
    color: '#64748B',
    background: '#F1F5F9',
    borderBottom: '2px solid #E2E8F0',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  thFirst: {
    borderTopLeftRadius: '0',
    textAlign: 'left',
  },
  thLast: {
    borderTopRightRadius: '0',
  },
  row: {
    borderBottom: '1px solid #F1F5F9',
  },
  rowHighlight: {
    background: 'rgba(0,71,204,0.04)',
    borderBottom: '2px solid #0047CC',
  },
  td: {
    padding: '10px 12px',
    textAlign: 'center',
    color: '#334155',
    whiteSpace: 'nowrap',
  },
  valor: {
    fontFamily: "'Courier New', monospace",
    fontWeight: 600,
    color: '#1E293B',
  },
  diff: {
    fontFamily: "'Courier New', monospace",
    fontWeight: 600,
    color: '#DC2626',
    fontSize: '12px',
  },
  diffConverge: {
    color: '#059669',
  },
  na: {
    color: '#94A3B8',
    fontWeight: 500,
  },
  footer: {
    fontSize: '12px',
    color: '#64748B',
    fontStyle: 'italic',
    margin: 0,
    padding: '10px 16px',
    background: '#F8FAFC',
    borderTop: '1px solid #E2E8F0',
  },
};
