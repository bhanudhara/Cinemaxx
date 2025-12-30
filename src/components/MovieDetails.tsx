import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../api/tmdb';
import type { Movie } from './MovieList';

interface MovieDetailsProps {
  movieId: number;
  onClose: () => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onClose, onToggleFavorite, isFavorite }) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMovies(`/movie/${movieId}`, { append_to_response: 'credits,videos' }).then(data => {
      setMovie(data);
      setLoading(false);
    });
  }, [movieId]);

  if (loading) return <div>Loading details...</div>;
  if (!movie) return null;

  const cast = movie.credits?.cast?.slice(0, 5) || [];
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} style={{ float: 'right' }}>Close</button>
        <h2>{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
        <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ float: 'left', marginRight: 16 }} />
        <div><b>Type:</b> {movie.genres?.map((g: any) => g.name).join(', ')}</div>
        <div><b>Rating:</b> {movie.vote_average}</div>
        <div><b>Synopsis:</b> {movie.overview}</div>
        <div><b>Cast:</b> {cast.map((c: any) => c.name).join(', ')}</div>
        <button onClick={() => onToggleFavorite(movie)}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        {trailer && (
          <div style={{ marginTop: 16 }}>
            <b>Trailer:</b>
            <iframe width="360" height="215" src={`https://www.youtube.com/embed/${trailer.key}`} title="Trailer" allowFullScreen></iframe>
          </div>
        )}
      </div>
    </div>
  );
};
