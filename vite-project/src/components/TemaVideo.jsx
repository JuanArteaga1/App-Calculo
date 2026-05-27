import { useMemo, useState } from 'react';
import { extraerYoutubeId, youtubeThumb, youtubeEmbed, getVideoByTema, videosBase } from '../data/videos';

export default function TemaVideo({ unidadId, temaId }) {
  const principal = getVideoByTema(unidadId, temaId);
  const relacionado = useMemo(() => {
    if (!principal) return null;
    return videosBase.find((video) => video.unidad === unidadId && video.id !== principal.id) || null;
  }, [principal, unidadId]);

  const videos = [
    principal ? { ...principal, etiqueta: 'Video explicativo' } : null,
    relacionado ? { ...relacionado, etiqueta: 'Video relacionado' } : null,
  ].filter(Boolean);

  const [activeId, setActiveId] = useState(videos[0] ? extraerYoutubeId(videos[0].youtubeId) : null);

  if (!videos.length) {
    return (
      <section style={styles.placeholder}>
        <div style={styles.placeholderIcon}>🎬</div>
        <div style={styles.placeholderText}>Videos de apoyo proximamente</div>
      </section>
    );
  }

  const activeVideo = videos.find((video) => extraerYoutubeId(video.youtubeId) === activeId) || videos[0];
  const activeYoutubeId = extraerYoutubeId(activeVideo.youtubeId);

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerTitle}>Videos de apoyo</div>
          <div style={styles.headerMeta}>Explicacion principal y recurso relacionado en un solo lugar</div>
        </div>
      </div>

      <div style={styles.videoBox}>
        <iframe
          style={styles.iframe}
          src={youtubeEmbed(activeYoutubeId)}
          title={activeVideo.titulo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="tema-video-grid" style={styles.grid}>
        {videos.map((video) => {
          const youtubeId = extraerYoutubeId(video.youtubeId);
          const isActive = youtubeId === activeYoutubeId;

          return (
            <button
              key={video.id}
              type="button"
              style={{ ...styles.videoCard, ...(isActive ? styles.videoCardActive : {}) }}
              onClick={() => setActiveId(youtubeId)}
            >
              <div style={styles.thumbWrap}>
                <img
                  src={youtubeThumb(youtubeId)}
                  alt={video.titulo}
                  style={styles.thumb}
                  onError={(e) => { e.currentTarget.src = '/Estudiantes(1).jpeg'; }}
                />
                <span style={styles.playBadge}>▶</span>
                <span style={styles.duration}>{video.duracion}</span>
              </div>
              <div style={styles.videoInfo}>
                <span style={styles.videoTag}>{video.etiqueta}</span>
                <strong style={styles.videoTitle}>{video.titulo}</strong>
                <span style={styles.videoDesc}>{video.descripcion}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const styles = {
  container: {
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 12px',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#1E293B',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  headerMeta: {
    fontSize: '13px',
    color: '#64748B',
    marginTop: '2px',
  },
  videoBox: {
    background: '#000',
    aspectRatio: '16/9',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '14px',
    padding: '16px',
  },
  videoCard: {
    border: '1px solid #E2E8F0',
    background: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
  },
  videoCardActive: {
    borderColor: '#0047CC',
    boxShadow: '0 8px 20px rgba(0,71,204,0.14)',
    transform: 'translateY(-2px)',
  },
  thumbWrap: {
    position: 'relative',
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    display: 'block',
  },
  playBadge: {
    position: 'absolute',
    left: '10px',
    bottom: '10px',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#fff',
    color: '#0047CC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
  },
  duration: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    padding: '4px 8px',
    borderRadius: '6px',
  },
  videoInfo: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  videoTag: {
    width: 'fit-content',
    color: '#0047CC',
    background: 'rgba(0,71,204,0.08)',
    fontSize: '10px',
    fontWeight: 800,
    padding: '4px 8px',
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  videoTitle: {
    color: '#1E293B',
    fontSize: '14px',
    lineHeight: 1.35,
    fontFamily: "'Poppins', sans-serif",
  },
  videoDesc: {
    color: '#64748B',
    fontSize: '12px',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: '#F8FAFC',
    borderRadius: '16px',
    border: '1px dashed #CBD5E1',
  },
  placeholderIcon: {
    fontSize: '24px',
  },
  placeholderText: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: 500,
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .tema-video-grid { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(style);
}
