import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { MovieList } from './MovieList'
import { MovieSearch } from './MovieSearch'
import { MovieDetails } from './MovieDetails'
import { Favorites } from './Favorites'
import './MovieDetails.css'
import '../App.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  // Removed automatic redirect to avoid conflicting navigation with App.tsx
  // App controls route guards via auth state

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

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('user')
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
    <div style={{fontSize:18 , fontWeight:500}}>Hi, {displayName}</div>

        <div style={{ position: 'relative' }}>
          <span
            onClick={() => setProfileOpen(p => !p)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {initial}
            </div>
          </span>

          {profileOpen && (
            <div style={{ position: 'absolute', right: 0, top: 48, background: '#fff', border: '1px solid #ddd', borderRadius: 8, minWidth: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10 }}>
            
              <div style={{ padding: 8 }}>
                <button
                  style={{width: '100%', padding: 8, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#c62828' }}
                  onClick={() => { setProfileOpen(false); navigate('/profile') }}
                >
                  Profile
                </button>

                <button
                  style={{ width: '100%', padding: 8, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#c62828'}}
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