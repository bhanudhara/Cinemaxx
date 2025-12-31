import React, { useRef, useEffect, useState } from 'react';
import type { Movie } from './MovieList';

interface FavoritesProps {
  favorites: Movie[];
  onSelect: (movie: Movie) => void;
  onRemove: (movie: Movie) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, onSelect, onRemove }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const scrollAmount = 300;

  useEffect(() => {
    const handleResize = () => {
      if (!scrollRef.current) return;
      const isMobile = window.innerWidth <= 600;
      setShowArrows(!isMobile && scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 10);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [favorites]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const iconBtnStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    background: '#fff',
    border: '2px solid #1976d2',
    color: '#1976d2',
    fontSize: 22,
    cursor: 'pointer',
    height: 44,
    width: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  };

  return (
    <div style={{ margin: '2rem 0', position: 'relative', width: '100%' }}>
      <h2>Favorites</h2>
      {showArrows && (
        <>
          <button aria-label="Scroll left" onClick={scrollLeft} style={iconBtnStyle}>
            <span className="material-icons" style={{ fontSize: 20 }}>chevron_left</span>
          </button>
          <button aria-label="Scroll right" onClick={scrollRight} style={{ ...iconBtnStyle, left: 'auto', right: 0 }}>
            <span className="material-icons" style={{ fontSize: 20 }}>chevron_right</span>
          </button>
        </>
      )}
      <div
        id="style-16"
        className="hide-scroll"
        ref={scrollRef}
        style={{ display: 'flex', overflowX: 'auto', gap: 16, scrollBehavior: 'smooth', padding: showArrows ? '0 48px' : 0 }}
      >
        {favorites.length === 0 && <div>No favorites yet.</div>}
        {favorites.map(movie => (
          <div key={movie.id} style={{ minWidth: 180, position: 'relative' }}>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%', cursor: 'pointer' }} onClick={() => onSelect(movie)} />
            <div>{movie.title}</div>
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: '#fff',
                border: '2px solid rgb(198, 40, 40)',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgb(198, 40, 40)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onClick={() => onRemove(movie)}
              aria-label="Remove favorite"
            >
              <span className="material-icons" style={{ fontSize: 14 }}>close</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
