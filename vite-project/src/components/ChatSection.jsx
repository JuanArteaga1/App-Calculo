import { useState, useRef, useEffect } from 'react';
import { chatbotMensaje } from '../services/chatbotService';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

export default function ChatSection({ tema = 'limites', unidadTitulo = '' }) {
  const [messages, setMessages] = useState(() => [
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

  // Renderizar LaTeX en mensajes
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
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const res = await chatbotMensaje(tema, userMsg);

    if (!res.ok) {
      if (res.error === 'NO_API_KEY') {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: '⚠️ Para usar el chatbot, configura tu API key de OpenAI. Crea un archivo `.env` en la raíz con:\n\n`VITE_OPENAI_API_KEY=sk-tu-clave-aqui`\n\nLuego reinicia el servidor.',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: `❌ Error: ${res.error}\n\nPor favor intenta de nuevo en un momento.`,
          },
        ]);
      }
    } else {
      setMessages((prev) => [...prev, { from: 'bot', text: res.respuesta }]);
    }

    setLoading(false);
  };

  const getNombreTema = () => {
    if (tema === 'limites') return 'Límites';
    if (tema === 'derivadas') return 'Derivadas';
    if (tema === 'aplicaciones') return 'Aplicaciones';
    return 'Cálculo';
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div style={styles.headerIcon}>🎓</div>
        <div>
          <h2 style={styles.title}>Asistente de {getNombreTema()}</h2>
          <p style={styles.subtitle}>
            Pregunta cualquier ejercicio de este tema. Te lo resuelvo paso a paso.
          </p>
        </div>
      </div>

      <div style={styles.chatWrap}>
        <div ref={mathRef} style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.row,
                ...(m.from === 'user' ? styles.rowUser : {}),
              }}
            >
              <div style={styles.avatarWrap}>
                <div style={m.from === 'user' ? styles.avatarUser : styles.avatarBot}>
                  {m.from === 'user' ? '👤' : '🎓'}
                </div>
              </div>
              <div
                style={{
                  ...styles.bubble,
                  ...(m.from === 'user' ? styles.bubbleUser : styles.bubbleBot),
                }}
              >
                {m.text.split('\n').map((line, idx) => (
                  <p key={idx} style={styles.line}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.row}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatarBot}>🎓</div>
              </div>
              <div style={{ ...styles.bubble, ...styles.bubbleBot, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={styles.dot}>●</span>
                <span style={{ ...styles.dot, animationDelay: '0.2s' }}>●</span>
                <span style={{ ...styles.dot, animationDelay: '0.4s' }}>●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Escribe tu ejercicio o pregunta... Ej: 'Calcula el límite de x² cuando x→3'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" style={styles.sendBtn} disabled={loading}>
            {loading ? '...' : 'Enviar ➤'}
          </button>
        </form>
      </div>

      <div style={styles.tips}>
        <strong>💡 Tips:</strong> Puedes preguntar ejercicios específicos, pedir explicaciones de conceptos, o solicitar ejemplos adicionales. ¡Sé específico para mejores respuestas!
      </div>
    </div>
  );
}

function getMensajeBienvenida(tema, unidadTitulo) {
  const titulo = unidadTitulo || (tema === 'limites' ? 'Límites' : tema === 'derivadas' ? 'Derivadas' : 'Aplicaciones');
  return `¡Hola! Soy tu asistente de **${titulo}**.\n\nEstoy aquí para ayudarte con cualquier ejercicio de este tema. Puedes escribir algo como:\n\n• "Calcula el límite de x² - 4 / x - 2 cuando x→2"\n• "Deriva f(x) = sin(x) + x³ paso a paso"\n• "¿Cómo encuentro los máximos de una función?"\n\n¡Adelante, pregunta lo que necesites!`;
}

const styles = {
  container: {
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px',
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px 28px',
    background: '#0A1628',
    color: '#fff',
  },
  headerIcon: {
    fontSize: '36px',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 4px',
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.75)',
    margin: 0,
  },
  chatWrap: {
    display: 'flex',
    flexDirection: 'column',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  messages: {
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '520px',
    overflowY: 'auto',
    minHeight: '200px',
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  rowUser: {
    flexDirection: 'row-reverse',
  },
  avatarWrap: {
    flexShrink: 0,
  },
  avatarBot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#0A1628',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  avatarUser: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#0047CC',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  bubble: {
    padding: '14px 18px',
    borderRadius: '16px',
    fontSize: '15px',
    lineHeight: 1.65,
    maxWidth: '80%',
    wordBreak: 'break-word',
  },
  bubbleBot: {
    background: '#fff',
    color: '#1E293B',
    border: '1px solid #E2E8F0',
    borderTopLeftRadius: '4px',
  },
  bubbleUser: {
    background: '#0047CC',
    color: '#fff',
    borderTopRightRadius: '4px',
  },
  line: {
    margin: '0 0 6px',
    padding: 0,
  },
  dot: {
    fontSize: '10px',
    color: '#64748B',
    animation: 'blink 1.4s infinite both',
  },
  form: {
    display: 'flex',
    gap: '12px',
    padding: '16px 28px',
    background: '#fff',
    borderTop: '1px solid #E2E8F0',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    fontSize: '15px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    background: '#F8FAFC',
  },
  sendBtn: {
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    background: '#F4B400',
    color: '#1a1a1a',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(244,180,0,0.25)',
  },
  tips: {
    padding: '16px 28px',
    background: '#EFF6FF',
    color: '#1E40AF',
    fontSize: '13px',
    lineHeight: 1.5,
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
