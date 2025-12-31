import React, { useState } from 'react';
import { fetchMovies } from '../api/tmdb';
import type { Movie } from './MovieList';

export const MovieSearch: React.FC<{ onSelect: (movie: Movie) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const data = await fetchMovies('/search/movie', { query });
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 48px 12px 16px',
            borderRadius: '24px',
            border: '1px solid #ccc',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.2s'
          }}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
      {loading && <div>Searching...</div>}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 16, marginTop: 16 }}>
        {results.map(movie => (
          <div key={movie.id} style={{ minWidth: 180, cursor: 'pointer' }} onClick={() => onSelect(movie)}>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }} />
            <div>{movie.title}</div>
            <div>{movie.release_date}</div>
            <div>⭐ {movie.vote_average}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
