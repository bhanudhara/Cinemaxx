import React from 'react';
import type { Movie } from './MovieList';

interface FavoritesProps {
  favorites: Movie[];
  onSelect: (movie: Movie) => void;
  onRemove: (movie: Movie) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, onSelect, onRemove }) => (
  <div style={{ margin: '2rem 0' }}>
    <h2>Favorites</h2>
    <div style={{ display: 'flex', overflowX: 'auto', gap: 16 }}>
      {favorites.length === 0 && <div>No favorites yet.</div>}
      {favorites.map(movie => (
        <div key={movie.id} style={{ minWidth: 180, position: 'relative' }}>
          <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%', cursor: 'pointer' }} onClick={() => onSelect(movie)} />
          <div>{movie.title}</div>
          <button style={{ position: 'absolute', top: 4, right: 4 }} onClick={() => onRemove(movie)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  </div>
);
