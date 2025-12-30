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
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Search</button>
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
