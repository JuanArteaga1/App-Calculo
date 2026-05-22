import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.emoji}>💥</div>
          <h2 style={styles.title}>Error en el Laboratorio de Graficación</h2>
          <p style={styles.desc}>
            Ocurrió un error inesperado. Por favor revisa la consola del navegador para más detalles.
          </p>
          <details style={styles.details}>
            <summary style={styles.summary}>Ver detalles técnicos</summary>
            <pre style={styles.pre}>
{this.state.error?.toString()}

{this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button
            style={styles.btn}
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    padding: '32px 24px',
    textAlign: 'center',
    background: '#FEF2F2',
    borderRadius: '16px',
    border: '1px solid #FECACA',
    margin: '16px 0',
  },
  emoji: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#DC2626',
    margin: '0 0 8px',
    fontFamily: "'Poppins', sans-serif",
  },
  desc: {
    fontSize: '14px',
    color: '#991B1B',
    margin: '0 0 16px',
  },
  details: {
    textAlign: 'left',
    margin: '16px 0',
  },
  summary: {
    cursor: 'pointer',
    color: '#DC2626',
    fontWeight: 600,
    fontSize: '14px',
  },
  pre: {
    background: '#FEE2E2',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#7F1D1D',
    overflowX: 'auto',
    marginTop: '8px',
    textAlign: 'left',
  },
  btn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#DC2626',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
  },
};
