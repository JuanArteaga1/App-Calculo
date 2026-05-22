import { useState, useRef, useEffect } from 'react';
import { chatbotMensaje } from '../services/chatbotService';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

export default function ChatbotWidget({ tema = 'limites', unidadTitulo = '' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: getMensajeBienvenida(tema, unidadTitulo),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const mathRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Renderizar LaTeX cada vez que cambian los mensajes
  useEffect(() => {
    if (mathRef.current) {
      renderMathInElement(mathRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
        errorColor: '#DC2626',
      });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const res = await chatbotMensaje(tema, userMsg);

    if (!res.ok) {
      if (res.error === 'NO_API_KEY') {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: '⚠️ Para usar el chatbot, configura tu API key de OpenAI. Crea un archivo `.env` en la raíz con:\n\n`VITE_OPENAI_API_KEY=sk-tu-clave-aqui`\n\nLuego reinicia el servidor.',
        }]);
      } else {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: `❌ Error: ${res.error}\n\nPor favor intenta de nuevo en un momento.`,
        }]);
      }
    } else {
      setMessages(prev => [...prev, { from: 'bot', text: res.respuesta }]);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={styles.fab}
        aria-label="Asistente IA"
        title="Asistente de matemáticas"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {open && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <div style={styles.avatar}>🎓</div>
              <div>
                <div style={styles.headerTitle}>Asistente de {getNombreTema(tema)}</div>
                <div style={styles.headerStatus}>Resuelve ejercicios paso a paso</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn} aria-label="Cerrar">✕</button>
          </div>

          <div ref={mathRef} style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageRow,
                  ...(m.from === 'user' ? styles.messageRowUser : {}),
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    ...(m.from === 'user' ? styles.bubbleUser : styles.bubbleBot),
                  }}
                >
                  {m.text.split('\n').map((line, idx) => (
                    <p key={idx} style={styles.msgLine}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.messageRow}>
                <div style={{ ...styles.bubble, ...styles.bubbleBot, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={styles.typingDot}>●</span>
                  <span style={styles.typingDot}>●</span>
                  <span style={styles.typingDot}>●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Escribe tu ejercicio o pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" style={styles.sendBtn} aria-label="Enviar" disabled={loading}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function getMensajeBienvenida(tema, unidadTitulo) {
  const titulo = unidadTitulo || getNombreTema(tema);
  return `¡Hola! Soy tu asistente de **${titulo}**.\n\nPregúntame cualquier ejercicio de este tema y te lo resuelvo paso a paso. Puedes escribir algo como:\n\n• "Calcula el límite de x² cuando x→3"\n• "Deriva f(x) = sin(x) + x³"\n• "¿Cómo encuentro los máximos de una función?"`;
}

function getNombreTema(tema) {
  if (tema === 'limites') return 'Límites';
  if (tema === 'derivadas') return 'Derivadas';
  if (tema === 'aplicaciones') return 'Aplicaciones';
  return 'Cálculo';
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#0047CC',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,71,204,0.35)',
    border: 'none',
    cursor: 'pointer',
    zIndex: 999,
    transition: 'transform 0.2s ease',
  },
  panel: {
    position: 'fixed',
    bottom: '92px',
    right: '24px',
    width: '400px',
    maxWidth: 'calc(100vw - 48px)',
    height: '540px',
    maxHeight: 'calc(100vh - 120px)',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 998,
    border: '1px solid #E2E8F0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: '#0A1628',
    color: '#fff',
    flexShrink: 0,
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
  },
  headerStatus: {
    fontSize: '11px',
    opacity: 0.8,
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: '#F8FAFC',
  },
  messageRow: {
    display: 'flex',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: 1.6,
    maxWidth: '85%',
    wordBreak: 'break-word',
  },
  bubbleBot: {
    background: '#fff',
    color: '#1E293B',
    border: '1px solid #E2E8F0',
    borderBottomLeftRadius: '4px',
  },
  bubbleUser: {
    background: '#0047CC',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  msgLine: {
    margin: '0 0 6px',
    padding: 0,
  },
  typingDot: {
    fontSize: '10px',
    color: '#64748B',
    animation: 'blink 1.4s infinite both',
  },
  form: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderTop: '1px solid #E2E8F0',
    background: '#fff',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    background: '#F8FAFC',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: '#F4B400',
    color: '#1a1a1a',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
