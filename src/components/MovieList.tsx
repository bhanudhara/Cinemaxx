import React, { useEffect, useRef, useState } from 'react';
import { fetchMovies } from '../api/tmdb';
import './MovieList.css';

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

interface MovieListProps {
  category: string;
  title: string;
}

export const MovieList: React.FC<MovieListProps> = ({ category, title }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const scrollAmount = 300;

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchMovies(`/movie/${category}`)
      .then(data => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load movies');
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    const handleResize = () => {
      if (!scrollRef.current) return;
      const isMobile = window.innerWidth <= 600;
      setShowArrows(!isMobile && scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 10);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies]);

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
    <>
    <div style={{ margin: '2rem 0', position: 'relative', width: '100%' }}>
              <h3 style={{marginTop: 0}}>{title}</h3>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && movies.length === 0 && <div>No movies found.</div>}
      {showArrows && (
        <>
          <button aria-label="Scroll left" onClick={scrollLeft} style={{ ...iconBtnStyle, left: 0 }}>
            <span className="material-icons" style={{ fontSize: 20 }}>chevron_left</span>
          </button>
          <button aria-label="Scroll right" onClick={scrollRight} style={{ ...iconBtnStyle, right: 0 }}>
            <span className="material-icons" style={{ fontSize: 20 }}>chevron_right</span>
          </button>
        </>
      )}
      <div
        id="style-16"
        className="hide-scroll"
        ref={scrollRef}
        style={{ display: 'flex', overflowX: 'auto', gap: 16, scrollBehavior: 'smooth', padding: 0 }}
      >
        {movies.map(movie => (
          <div key={movie.id} style={{ minWidth: 180, position: 'relative' }}>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }} />
            <div style={{ textAlign: 'center', marginTop: 8 }}>{movie.title}</div>
            <div style={{ textAlign: 'center', color: '#888' }}>{movie.release_date}</div>
            <div style={{ textAlign: 'center', color: '#1976d2' }}>⭐ {movie.vote_average}</div>
          </div>
        )
      )}
    </div>
    </div>
    </>
  );
}
