// Utility for TMDB API requests
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const BEARER = import.meta.env.VITE_TMDB_BEARER_TOKEN as string | undefined;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    ...(BEARER ? { Authorization: `Bearer ${BEARER}` } : {}),
  },
  timeout: 10000,
});

export const fetchMovies = async (endpoint: string, params: Record<string, any> = {}) => {
  try {
    const finalParams = { ...params };
    if (!BEARER && API_KEY) finalParams.api_key = API_KEY;
    const res = await api.get(endpoint, { params: finalParams });
    return res.data;
  } catch (err: any) {
    console.error('TMDB API error:', err?.response?.data || err.message || err);
    throw new Error(
      err?.response?.data?.status_message ||
      'Failed to fetch data from TMDB. Please try again later.'
    );
  }
};

export const fetchPopularMovies = async (page = 1, extraParams: Record<string, any> = {}) =>
  fetchMovies('/movie/popular', { page, ...extraParams });

export const fetchNowPlayingMovies = async (page = 1, extraParams: Record<string, any> = {}) =>
  fetchMovies('/movie/now_playing', { page, ...extraParams });

export const fetchUpcomingMovies = async (page = 1, extraParams: Record<string, any> = {}) =>
  fetchMovies('/movie/upcoming', { page, ...extraParams });

export const fetchTopRatedMovies = async (page = 1, extraParams: Record<string, any> = {}) =>
  fetchMovies('/movie/top_rated', { page, ...extraParams });

export const searchMovies = async (query: string, page = 1, extraParams: Record<string, any> = {}) =>
  fetchMovies('/search/movie', { query, page, ...extraParams });
