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

  return (
    <div style={{ margin: '2rem 0', position: 'relative', width: '100%' }}>
      <h2>Favorites</h2>
      {showArrows && (
        <>
          <button
            aria-label="Scroll left"
            onClick={scrollLeft}
            style={{
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
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="11" stroke="#1976d2" strokeWidth="2" fill="none"/><polyline points="14 8 10 12 14 16" /></svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={scrollRight}
            style={{
              position: 'absolute',
              right: 0,
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
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="11" stroke="#1976d2" strokeWidth="2" fill="none"/><polyline points="10 8 14 12 10 16" /></svg>
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
            <button style={{ position: 'absolute', top: 4, right: 4, background: '#fff', border: '2px solid #1976d2', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1976d2', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onClick={() => onRemove(movie)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="11" stroke="#1976d2" strokeWidth="2" fill="none"/><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
