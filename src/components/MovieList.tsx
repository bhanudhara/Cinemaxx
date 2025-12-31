import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../api/tmdb';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMovies(`/movie/${category}`)
      .then(data => {
        setMovies(data?.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load movies.');
        setLoading(false);
      });
  }, [category]);

  if (loading) return <div>Loading {title}...</div>;
  if (error) return <div style={{ color: 'red' }}>Error loading {title}: {error}</div>;

  return (
    <div>
      <h2>{title}</h2>
      <div
        id="style-16"
        style={{ display: 'flex', overflowX: 'auto', gap: 16 }}
      >
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map(movie => (
            <div key={movie.id} style={{ minWidth: 180 }}>
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : ''} alt={movie.title} style={{ width: '100%' }} />
              <div>{movie.title}</div>
              <div>{movie.release_date}</div>
              <div>⭐ {movie.vote_average}</div>
            </div>
          ))
        ) : (
          <div>No movies found.</div>
        )}
      </div>
    </div>
  );
};
