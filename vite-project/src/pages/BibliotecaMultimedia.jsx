import { useState, useMemo, useEffect } from 'react';
import {
  videosBase,
  categorias,
  niveles,
  extraerYoutubeId,
  youtubeThumb,
  youtubeEmbed,
} from '../data/videos';

const STORAGE_KEY = 'limitshub_videos';

function loadCustomVideos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomVideos(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function BibliotecaMultimedia() {
  const [customVideos, setCustomVideos] = useState(loadCustomVideos);
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [nivelActivo, setNivelActivo] = useState('todos');
  const [vistos, setVistos] = useState(() => {
    const initial = {};
    [...videosBase, ...customVideos].forEach((v) => {
      initial[v.id] = v.visto || false;
    });
    return initial;
  });
  const [reproduciendo, setReproduciendo] = useState(null);

  // Formulario agregar video
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoUrl, setNuevoUrl] = useState('');
  const [nuevoDesc, setNuevoDesc] = useState('');
  const [nuevoUnidad, setNuevoUnidad] = useState('limites');
  const [nuevoNivel, setNuevoNivel] = useState('basico');
  const [nuevoDuracion, setNuevoDuracion] = useState('');
  const [formError, setFormError] = useState('');

  const allVideos = useMemo(() => [...videosBase, ...customVideos], [customVideos]);

  useEffect(() => {
    const initial = {};
    allVideos.forEach((v) => {
      if (!(v.id in vistos)) initial[v.id] = v.visto || false;
    });
    if (Object.keys(initial).length > 0) {
      setVistos((prev) => ({ ...prev, ...initial }));
    }
  }, [allVideos]);

  const filtrados = useMemo(() => {
    return allVideos.filter((v) => {
      const matchSearch =
        v.titulo.toLowerCase().includes(search.toLowerCase()) ||
        v.descripcion.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoriaActiva === 'todos' || v.unidad === categoriaActiva;
      const matchNivel = nivelActivo === 'todos' || v.nivel === nivelActivo;
      return matchSearch && matchCat && matchNivel;
    });
  }, [search, categoriaActiva, nivelActivo, allVideos]);

  const toggleVisto = (id) => {
    setVistos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAgregarVideo = (e) => {
    e.preventDefault();
    setFormError('');

    const youtubeId = extraerYoutubeId(nuevoUrl);
    if (!youtubeId) {
      setFormError('URL de YouTube no válida. Intenta con https://www.youtube.com/watch?v=... o https://youtu.be/...');
      return;
    }
    if (!nuevoTitulo.trim()) {
      setFormError('Ingresa un título para el video.');
      return;
    }

    const nuevo = {
      id: `custom-${Date.now()}`,
      titulo: nuevoTitulo.trim(),
      descripcion: nuevoDesc.trim() || 'Video agregado por el usuario',
      youtubeId,
      unidad: nuevoUnidad,
      nivel: nuevoNivel,
      duracion: nuevoDuracion.trim() || '??:??',
      visto: false,
    };

    const updated = [...customVideos, nuevo];
    setCustomVideos(updated);
    saveCustomVideos(updated);

    // Limpiar formulario
    setNuevoTitulo('');
    setNuevoUrl('');
    setNuevoDesc('');
    setNuevoDuracion('');
    setMostrarForm(false);
  };

  const handleEliminarVideo = (id) => {
    const updated = customVideos.filter((v) => v.id !== id);
    setCustomVideos(updated);
    saveCustomVideos(updated);
    if (reproduciendo === id) setReproduciendo(null);
  };

  const videoActual = allVideos.find((v) => v.id === reproduciendo);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.tag}>HU09 — Sprint 3</span>
          <h1 style={styles.title}>Biblioteca Multimedia</h1>
          <p style={styles.desc}>
            Refuerza tu comprensión con explicaciones audiovisuales organizadas por tema, módulo y nivel de complejidad.
          </p>
        </div>

        {/* Reproductor YouTube */}
        {videoActual && (
          <div style={styles.playerWrap}>
            <div style={styles.playerHeader}>
              <div>
                <h3 style={styles.playerTitle}>{videoActual.titulo}</h3>
                <p style={styles.playerMeta}>{videoActual.descripcion}</p>
              </div>
              <button style={styles.playerClose} onClick={() => setReproduciendo(null)} title="Cerrar reproductor">
                ✕
              </button>
            </div>
            <div style={styles.videoBox}>
              <iframe
                style={styles.iframe}
                src={youtubeEmbed(videoActual.youtubeId)}
                title={videoActual.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={styles.playerControls}>
              <span style={styles.playerBadge}>
                {videoActual.nivel === 'basico' ? '🟢 Básico' : videoActual.nivel === 'intermedio' ? '🟡 Intermedio' : '🔴 Avanzado'}
              </span>
              <span style={styles.playerBadge}>⏱ {videoActual.duracion}</span>
              {vistos[videoActual.id] && <span style={styles.playerBadgeVisto}>✓ Visto</span>}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div style={styles.filters}>
          <div style={styles.searchWrap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              style={styles.searchInput}
              placeholder="Buscar videos por título o tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Módulo:</span>
            <div style={styles.filterButtons}>
              {categorias.map((c) => (
                <button
                  key={c.id}
                  style={{ ...styles.filterBtn, ...(categoriaActiva === c.id ? styles.filterBtnActive : {}) }}
                  onClick={() => setCategoriaActiva(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Nivel:</span>
            <div style={styles.filterButtons}>
              {niveles.map((n) => (
                <button
                  key={n.id}
                  style={{ ...styles.filterBtn, ...(nivelActivo === n.id ? styles.filterBtnActive : {}) }}
                  onClick={() => setNivelActivo(n.id)}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botón agregar */}
        <div style={styles.addBar}>
          <div style={styles.resultsCount}>
            {filtrados.length} video{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
            {' · '}
            {Object.values(vistos).filter(Boolean).length}/{allVideos.length} vistos
          </div>
          <button style={styles.addBtn} onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? '− Cancelar' : '+ Agregar video de YouTube'}
          </button>
        </div>

        {/* Formulario agregar video */}
        {mostrarForm && (
          <form onSubmit={handleAgregarVideo} style={styles.formPanel}>
            <h3 style={styles.formTitle}>📹 Agregar video de YouTube</h3>
            <div style={styles.formGrid}>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Título del video *</label>
                <input
                  style={styles.formInput}
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  placeholder="Ej: Introducción a Derivadas"
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>URL de YouTube *</label>
                <input
                  style={styles.formInput}
                  value={nuevoUrl}
                  onChange={(e) => setNuevoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Descripción</label>
                <input
                  style={styles.formInput}
                  value={nuevoDesc}
                  onChange={(e) => setNuevoDesc(e.target.value)}
                  placeholder="Breve descripción del contenido"
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Duración (ej: 12:34)</label>
                <input
                  style={styles.formInput}
                  value={nuevoDuracion}
                  onChange={(e) => setNuevoDuracion(e.target.value)}
                  placeholder="??:??"
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Módulo</label>
                <select style={styles.formInput} value={nuevoUnidad} onChange={(e) => setNuevoUnidad(e.target.value)}>
                  {categorias.filter((c) => c.id !== 'todos').map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Nivel</label>
                <select style={styles.formInput} value={nuevoNivel} onChange={(e) => setNuevoNivel(e.target.value)}>
                  {niveles.filter((n) => n.id !== 'todos').map((n) => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {formError && <div style={styles.formError}>{formError}</div>}
            <div style={styles.formActions}>
              <button type="submit" style={styles.formSubmit}>💾 Guardar video</button>
            </div>
          </form>
        )}

        {/* Grid de videos */}
        <div style={styles.grid}>
          {filtrados.map((video) => {
            const isCustom = video.id.startsWith('custom-');
            return (
              <div key={video.id} style={styles.card}>
                <div style={styles.thumbWrap} onClick={() => setReproduciendo(video.id)}>
                  <img
                    src={youtubeThumb(video.youtubeId)}
                    alt={video.titulo}
                    style={styles.thumb}
                    onError={(e) => { e.target.src = '/Estudiantes(1).jpeg'; }}
                  />
                  <div style={styles.thumbOverlay}>
                    <div style={styles.playBtn}>▶</div>
                  </div>
                  <span style={styles.duracion}>{video.duracion}</span>
                  {vistos[video.id] && <span style={styles.vistoBadge}>✓ Visto</span>}
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{video.titulo}</h3>
                  <p style={styles.cardDesc}>{video.descripcion}</p>
                  <div style={styles.cardMeta}>
                    <span
                      style={{
                        ...styles.nivelBadge,
                        ...(video.nivel === 'basico'
                          ? styles.nivelBasico
                          : video.nivel === 'intermedio'
                          ? styles.nivelIntermedio
                          : styles.nivelAvanzado),
                      }}
                    >
                      {video.nivel === 'basico' ? 'Básico' : video.nivel === 'intermedio' ? 'Intermedio' : 'Avanzado'}
                    </span>
                    <span style={styles.unidadBadge}>
                      {video.unidad === 'limites' ? 'Límites' : video.unidad === 'derivadas' ? 'Derivadas' : 'Aplicaciones'}
                    </span>
                  </div>
                  <div style={styles.cardActions}>
                    <button style={styles.actionBtnPlay} onClick={() => setReproduciendo(video.id)}>
                      ▶ Reproducir
                    </button>
                    <button
                      style={{
                        ...styles.actionBtnCheck,
                        ...(vistos[video.id] ? styles.actionBtnCheckActive : {}),
                      }}
                      onClick={() => toggleVisto(video.id)}
                    >
                      {vistos[video.id] ? '✓ Visto' : 'Marcar visto'}
                    </button>
                    {isCustom && (
                      <button
                        style={styles.actionBtnDelete}
                        onClick={() => handleEliminarVideo(video.id)}
                        title="Eliminar video"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtrados.length === 0 && (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No se encontraron videos</h3>
            <p style={styles.emptyText}>Intenta con otros términos de búsqueda, ajusta los filtros o agrega un video nuevo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 0 80px' },
  header: {
    textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px',
  },
  tag: {
    display: 'inline-block', padding: '6px 14px', background: 'rgba(0,71,204,0.08)',
    color: '#0047CC', fontSize: '13px', fontWeight: 700, borderRadius: '999px',
    marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  title: {
    fontSize: '32px', fontWeight: 800, color: '#1E293B', margin: '0 0 10px',
    fontFamily: "'Poppins', sans-serif",
  },
  desc: {
    fontSize: '16px', color: '#64748B', margin: 0, lineHeight: 1.55,
  },

  playerWrap: {
    background: '#0A1628', borderRadius: '20px', overflow: 'hidden',
    marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  playerHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '20px 24px 12px', gap: '16px',
  },
  playerTitle: {
    color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 4px',
    fontFamily: "'Poppins', sans-serif",
  },
  playerMeta: {
    color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0,
  },
  playerClose: {
    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
    width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer',
    fontSize: '16px', lineHeight: 1, flexShrink: 0,
  },
  videoBox: {
    background: '#000', aspectRatio: '16/9',
    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  iframe: {
    width: '100%', height: '100%', border: 'none', display: 'block',
  },
  playerControls: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 24px', background: 'rgba(255,255,255,0.04)',
    borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap',
  },
  playerBadge: {
    fontSize: '12px', color: 'rgba(255,255,255,0.7)',
    padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px',
  },
  playerBadgeVisto: {
    fontSize: '12px', color: '#fff',
    padding: '6px 12px', background: '#10B981', borderRadius: '8px', fontWeight: 700,
  },

  filters: {
    display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 16px',
  },
  searchInput: {
    flex: 1, padding: '14px 0', border: 'none', outline: 'none',
    fontSize: '15px', fontFamily: "'Inter', sans-serif", color: '#1E293B',
  },
  filterGroup: {
    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '13px', fontWeight: 600, color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  filterButtons: {
    display: 'flex', gap: '8px', flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0',
    background: '#fff', color: '#334155', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  filterBtnActive: {
    background: '#0047CC', color: '#fff', borderColor: '#0047CC',
  },

  addBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '20px', flexWrap: 'wrap', gap: '10px',
  },
  resultsCount: {
    fontSize: '13px', color: '#64748B', fontWeight: 600,
  },
  addBtn: {
    padding: '10px 18px', borderRadius: '10px', border: '2px dashed #0047CC',
    background: 'rgba(0,71,204,0.04)', color: '#0047CC', fontSize: '14px',
    fontWeight: 700, cursor: 'pointer',
  },

  formPanel: {
    background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0',
    padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  formTitle: {
    fontSize: '17px', fontWeight: 700, color: '#1E293B', margin: '0 0 16px',
    fontFamily: "'Poppins', sans-serif",
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
  },
  formField: {
    display: 'flex', flexDirection: 'column', gap: '6px',
  },
  formLabel: {
    fontSize: '12px', fontWeight: 700, color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  formInput: {
    padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0',
    fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none',
    background: '#fff', color: '#1E293B',
  },
  formError: {
    marginTop: '12px', padding: '10px 14px', background: '#FEF2F2',
    color: '#DC2626', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
  },
  formActions: {
    marginTop: '16px', display: 'flex', justifyContent: 'flex-end',
  },
  formSubmit: {
    padding: '10px 24px', borderRadius: '10px', border: 'none',
    background: '#0047CC', color: '#fff', fontSize: '14px', fontWeight: 700,
    cursor: 'pointer',
  },

  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
  },
  card: {
    background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0',
    overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex', flexDirection: 'column',
  },
  thumbWrap: {
    position: 'relative', cursor: 'pointer', overflow: 'hidden',
  },
  thumb: {
    width: '100%', height: '180px', objectFit: 'cover', display: 'block',
    transition: 'transform 0.3s ease',
  },
  thumbOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0, transition: 'opacity 0.2s ease',
  },
  playBtn: {
    width: '56px', height: '56px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.95)', color: '#0047CC',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', paddingLeft: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  duracion: {
    position: 'absolute', bottom: '10px', right: '10px',
    background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '12px',
    fontWeight: 700, padding: '4px 8px', borderRadius: '6px',
  },
  vistoBadge: {
    position: 'absolute', top: '10px', left: '10px',
    background: '#10B981', color: '#fff', fontSize: '11px',
    fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
  },
  cardBody: {
    padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1,
  },
  cardTitle: {
    fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: 0,
    fontFamily: "'Poppins', sans-serif", lineHeight: 1.3,
  },
  cardDesc: {
    fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0, flex: 1,
  },
  cardMeta: {
    display: 'flex', gap: '8px', flexWrap: 'wrap',
  },
  nivelBadge: {
    fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  nivelBasico: { background: 'rgba(16,185,129,0.1)', color: '#059669' },
  nivelIntermedio: { background: 'rgba(245,158,11,0.1)', color: '#D97706' },
  nivelAvanzado: { background: 'rgba(239,68,68,0.1)', color: '#DC2626' },
  unidadBadge: {
    fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    background: 'rgba(0,71,204,0.08)', color: '#0047CC',
  },
  cardActions: {
    display: 'flex', gap: '8px', marginTop: '4px',
  },
  actionBtnPlay: {
    flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
    background: '#0047CC', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  },
  actionBtnCheck: {
    padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0',
    background: '#fff', color: '#64748B', fontSize: '12px', fontWeight: 700,
    cursor: 'pointer', whiteSpace: 'nowrap',
  },
  actionBtnCheckActive: {
    background: '#10B981', color: '#fff', borderColor: '#10B981',
  },
  actionBtnDelete: {
    padding: '10px 12px', borderRadius: '10px', border: '1px solid #FECACA',
    background: '#FEF2F2', color: '#DC2626', fontSize: '14px', cursor: 'pointer',
  },

  empty: {
    textAlign: 'center', padding: '64px 24px',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: {
    fontSize: '20px', fontWeight: 700, color: '#1E293B', margin: '0 0 6px',
    fontFamily: "'Poppins', sans-serif",
  },
  emptyText: { fontSize: '15px', color: '#64748B', margin: 0 },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .biblioteca-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .biblioteca-form-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 768px) {
      .biblioteca-grid { grid-template-columns: 1fr !important; }
      .biblioteca-form-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(style);
}
