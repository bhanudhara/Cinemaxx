import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MovieList } from './MovieList'
import { MovieSearch } from './MovieSearch'
import { MovieDetails } from './MovieDetails'
import { Favorites } from './Favorites'
import './MovieDetails.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>(() => {
    const fav = localStorage.getItem('favorites')
    return fav ? JSON.parse(fav) : []
  })

  const handleToggleFavorite = (movie: any) => {
    let updated
    if (favorites.some((m) => m.id === movie.id)) {
      updated = favorites.filter((m) => m.id !== movie.id)
    } else {
      updated = [...favorites, movie]
    }
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  const handleRemoveFavorite = (movie: any) => {
    const updated = favorites.filter((m) => m.id !== movie.id)
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const [profileOpen, setProfileOpen] = useState(false)

  if (!user) return null

  const displayName = typeof user.email === 'string' ? user.email.split('@')[0] : 'User'
  const initial = displayName.charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
        <h1>Welcome, {displayName} ({user.provider})</h1>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(p => !p)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {initial}
            </div>
          </button>

          {profileOpen && (
            <div style={{ position: 'absolute', right: 0, top: 48, background: '#fff', border: '1px solid #ddd', borderRadius: 8, minWidth: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10 }}>
              <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 600 }}>{displayName}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{user.email}</div>
              </div>
              <div style={{ padding: 8 }}>
                <button
                  style={{ width: '100%', padding: 8, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => { setProfileOpen(false); navigate('/profile') }}
                >
                  Profile
                </button>

                <button
                  style={{ width: '100%', padding: 8, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); setProfileOpen(false) }}
                >
                  Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>

                <button
                  style={{ width: '100%', padding: 8, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#c62828' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

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
  )
}

export default Home