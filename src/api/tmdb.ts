// Fetch popular movies with pagination
export const fetchPopularMovies = async (page: number = 1, extraParams: Record<string, any> = {}) => {
  return fetchMovies('/movie/popular', { page, ...extraParams });
};

// Fetch now playing movies with pagination
export const fetchNowPlayingMovies = async (page: number = 1, extraParams: Record<string, any> = {}) => {
  return fetchMovies('/movie/now_playing', { page, ...extraParams });
};

// Fetch upcoming movies with pagination
export const fetchUpcomingMovies = async (page: number = 1, extraParams: Record<string, any> = {}) => {
  return fetchMovies('/movie/upcoming', { page, ...extraParams });
};

// Fetch top rated movies with pagination
export const fetchTopRatedMovies = async (page: number = 1, extraParams: Record<string, any> = {}) => {
  return fetchMovies('/movie/top_rated', { page, ...extraParams });
};

// Search movies with pagination
export const searchMovies = async (query: string, page: number = 1, extraParams: Record<string, any> = {}) => {
  return fetchMovies('/search/movie', { query, page, ...extraParams });
};
// Utility for TMDB API requests
import axios from 'axios';

// Use your TMDB Bearer token here
const TMDB_BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmU1NTIyNTNjMzkzYzQ0YTc5MjZhNjRmM2QxMzgzYyIsIm5iZiI6MTc2Njc1ODA1MC41ODgsInN1YiI6IjY5NGU5NmEyNzBjYzc0ZmY5MjA3MmMxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TX6Ev81Uxllq0huyNsX8VaQLfqpfCYXn6HN8TJVw9no';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (endpoint: string, params: Record<string, any> = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    // Log error for debugging
    console.error('TMDB API error:', error?.response?.data || error.message || error);
    // Throw a user-friendly error
    throw new Error(
      error?.response?.data?.status_message ||
      'Failed to fetch data from TMDB. Please try again later.'
    );
  }
};
