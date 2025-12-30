

import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { MovieList } from './components/MovieList';
import { MovieSearch } from './components/MovieSearch';
import './App.css';
import { MovieDetails } from './components/MovieDetails';
import { Favorites } from './components/Favorites';
import './components/MovieDetails.css';

const App: React.FC = () => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [isLogin, setIsLogin] = useState(true);

  if (!user) {
    return (
      <div className="auth-container">
        <AuthForm onAuth={setUser} isLogin={isLogin} />
        <button onClick={() => setIsLogin(l => !l)} style={{ marginTop: 8 }}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    );
  }

  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const fav = localStorage.getItem('favorites');
    return fav ? JSON.parse(fav) : [];
  });

  const handleToggleFavorite = (movie: any) => {
    let updated;
    if (favorites.some((m) => m.id === movie.id)) {
      updated = favorites.filter((m) => m.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleRemoveFavorite = (movie: any) => {
    const updated = favorites.filter((m) => m.id !== movie.id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div>
      <h1>Welcome, {user.email} ({user.provider})</h1>
      <button onClick={() => { localStorage.removeItem('user'); setUser(null); }}>
        Logout
      </button>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 8 }}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <Favorites
        favorites={favorites}
        onSelect={setSelectedMovie}
        onRemove={handleRemoveFavorite}
      />
      <MovieSearch onSelect={setSelectedMovie} />
      <div style={{ margin: '2rem 0' }}>
        <MovieList category="popular" title="Popular Movies" />
        <MovieList category="now_playing" title="Now Playing" />
        <MovieList category="upcoming" title="Upcoming Movies" />
        <MovieList category="top_rated" title="Top Rated Movies" />
      </div>
      {selectedMovie && (
        <MovieDetails
          movieId={selectedMovie.id}
          onClose={() => setSelectedMovie(null)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.some((m) => m.id === selectedMovie.id)}
        />
      )}
    </div>
  );
};

export default App;
